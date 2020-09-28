import { fetchUtils } from 'react-admin';
import { stringify } from 'query-string';
import Auth from '@aws-amplify/auth';

export default baseUrl => {
  const fetchJson = async (url, options = {}) => {
    if (!options.headers) {
      options.headers = new Headers({ Accept: 'application/json' });
    }

    const session = await Auth.currentSession();
    options.headers.set('Authorization', session.idToken.jwtToken);
    return fetchUtils.fetchJson(url, options);
  };

  const buildQs = (filter = {}) => Object.entries(filter).reduce((memo, [k, v]) => {
    memo[`q[${k}]`] = v;
    return memo;
  }, {});

  const create = (resource, params) => {
    console.log('dataProvider.create', resource, params);

    return fetchJson(`${baseUrl}/${resource}`, {
      method: 'POST',
      body: JSON.stringify(params.data),
    })
    
    .then(res => {
      return { data: res.json };
    });
  };

  return {
    /**
     * getList 
     */

    getList: async (resource, params) => {
      const { page = 1, perPage = 10 } = params.pagination || {};
      const { field = 'id', order = 'ASC' } = params.sort || {};

      const query = {
        limit: perPage,
        sort: `${field} ${order.toLowerCase()}`,
        offset: (page - 1) * perPage,
        ...buildQs(params.filter)
      };

      const url = `${baseUrl}/${resource}?${stringify(query)}`;
      const res = await fetchJson(url);

      return {
        data: res.json[kebabToCamel(resource)],
        total: res.json.total
      };
    },

    /**
     * getOne 
     */

    getOne: async (resource, params) => {
      const res = await fetchJson(`${baseUrl}/${resource}/${params.id}`)
      return { data: res.json };
    },

    /**
     * getMany 
     */

    getMany: (resource, params) => {
      console.log('getMany', resource, params);
      const query = params.ids.reduce((memo, id) => {
        return memo += `&q[id]=${id}`
      }, `qor=1`);

      const url = `${baseUrl}/${resource}?${query}`;

      return fetchJson(url).then(({ headers, json }) => ({
        data: json[kebabToCamel(resource)],
        total: json.total
      }));
    },

    /**
     * getManyReference 
     */

    getManyReference: (resource, params) => {
      console.log('getManyReference', resource, params);
      const { page, perPage } = params.pagination;
      const { field, order } = params.sort;
      const query = {
        sort: JSON.stringify([field, order]),
        range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
        filter: JSON.stringify({
          ...params.filter,
          [params.target]: params.id,
        }),
      };
      const url = `${baseUrl}/${resource}?${stringify(query)}`;

      return fetchJson(url).then(({ headers, json }) => ({
        data: json,
        total: parseInt(headers.get('content-range').split('/').pop(), 10),
      }));
    },

    /**
     * update 
     */

    update: (resource, params) => {
      console.log('dataProvider.update', resource, params);

      return fetchJson(`${baseUrl}/${resource}/${params.id}`, {
        method: 'PUT',
        body: JSON.stringify(params.data)
      
      }).then(res => {
        return { data: res.json };
      
      }).catch(err => {
        // Ugly hack for import overwrite
        if (err.status === 404) return create(resource, params);
        throw err;
      })
    },

    
    /**
     * updateMany 
     */

    updateMany: (resource, params) => {
      const query = {
        filter: JSON.stringify({ id: params.ids}),
      };
      return fetchJson(`${baseUrl}/${resource}?${stringify(query)}`, {
        method: 'PUT',
        body: JSON.stringify(params.data),
      }).then(({ json }) => ({ data: json }));
    },

    /**
     * create 
     */

    create,

    /**
     * delete 
     */

    delete: (resource, params) => {
      return fetchJson(`${baseUrl}/${resource}/${params.id}`, {
        method: 'DELETE',
      }).then(() => ({ data: resource }));
    },

    /**
     * deleteMany 
     */

    deleteMany: async (resource, params) => {
      const deletedIds = [];

      for (const id of params.ids) {
        const url = `${baseUrl}/${resource}/${id}`
        try {
          await fetchJson(url, { method: 'DELETE' });
          deletedIds.push(id);
        } catch (err) {
          console.log('delete error', err);
        }
      }
      return { data: deletedIds };
    }
  };
};

function kebabToCamel(s){
  return s.replace(/(-\w)/g, function(m){return m[1].toUpperCase();});
}