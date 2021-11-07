import { fetchUtils } from 'react-admin';
import { stringify } from 'query-string';
import { humanize, camelize, pluralize } from 'inflection';
import Auth from '@aws-amplify/auth';

export default apiUrl => {
  let getToken = async () => {
    const session = await Auth.currentSession();
    return session.idToken.jwtToken;
  };

  const fetchJson = async (path, options = {}) => {
    if (!options.headers) {
      options.headers = new Headers({ Accept: 'application/json' });
    }

    options.headers.set('Authorization', await getToken());

    const accountId = localStorage.getItem('accountId');
    if (accountId) {
      options.headers.set('Lolo-Account-Id', accountId);
    }

    return fetchUtils.fetchJson(apiUrl + path, options).catch(err => {
      if (err.body && err.body.error) {
        // 401, 403, 500
        err.message = err.body.error;
      } else if (err.body && err.body.errors) {
        // 422
        err.message = err.body.errors
          .map(item => {
            const field = humanize(item.dataPath.replace('.body.', ''));
            return `${field} ${item.message}`;
          })
          .join(', ');
      }

      throw err;
    });
  };

  const buildQs = (filter = {}) =>
    Object.entries(filter).reduce((memo, [k, v]) => {
      memo[`q[${k}]`] = v;
      return memo;
    }, {});

  const create = async (resource, params) => {
    const res = await fetchJson(`/${resource}`, {
      method: 'POST',
      body: JSON.stringify(params.data),
    });

    return { data: res.json };
  };

  const getList = async (resource, params, queryOpts = {}) => {
    console.log('getList', resource, params, q);

    const {
      page = 1,
      perPage = 10
    } = params.pagination || {};

    const {
      field = 'id',
      order = 'ASC'
    } = params.sort || {};

    query = {
      limit: perPage,
      sort: `${field} ${order.toLowerCase()}`,
      offset: (page - 1) * perPage,
      ...buildQs(params.filter),
      ...queryOpts
    };

    const url = `/${resource}?${queryString.stringify(query)}`;
    const res = await fetchJson(url);

    return {
      data: res.json[kebabToCamel(resource)],
      total: res.json.total
    };
  };

  return {
    /**
     * API URL
     */

    apiUrl,

    /**
     * Custom request
     */

    sendRequest: async (path, options) => {
      const res = await fetchJson(path, options);
      return { data: res.json };
    },

    /**
     * getList
     */

    getList,

    /**
     * getOne
     */

    getOne: async (resource, params) => {
      const res = await fetchJson(`/${resource}/${params.id}`);
      return { data: res.json };
    },

    /**
     * getMany
     */
    getMany: (resource, params) => {
      params.filter = { id: params.ids };

      return getList(resource, params, {
        qor: 1,
        qre: 0,
        limit: 100
      });
    },

    /**
     * getManyReference
     */
    getManyReference: (resource, params) => {
      params.filter[params.target] = params.id;

      return getList(resource, params, {
        qre: 0
      });
    },

    /**
     * update
     */

    update: (resource, params) => {
      return fetchJson(`/${resource}/${params.id}`, {
        method: 'PUT',
        body: JSON.stringify(params.data),
      })
        .then(res => {
          return { data: res.json };
        })
        .catch(err => {
          // Ugly hack for import overwrite
          if (err.status === 404) return create(resource, params);
          throw err;
        });
    },

    /**
     * updateMany
     */

    updateMany: (resource, params) => {
      throw new Error('Not implemented');
    },

    /**
     * create
     */

    create,

    /**
     * delete
     */

    delete: (resource, params) => {
      return fetchJson(`/${resource}/${params.id}`, {
        method: 'DELETE',
      }).then(() => ({ data: resource }));
    },

    /**
     * deleteMany
     */

    deleteMany: async (resource, params) => {
      const deletedIds = [];

      for (const id of params.ids) {
        const url = `/${resource}/${id}`;
        try {
          await fetchJson(url, { method: 'DELETE' });
          deletedIds.push(id);
        } catch (err) {
          console.log('delete error', err);
        }
      }
      return { data: deletedIds };
    },

    /**
     * getToken
     */

    get getToken() {
      return getToken;
    },

    set getToken(fn) {
      getToken = fn;
    },
  };
};

function kebabToCamel(s) {
  return s.replace(/(-\w)/g, function (m) {
    return m[1].toUpperCase();
  });
}
