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

  const buildQs = filter => Object.entries(filter).reduce((memo, [k, v]) => {
    memo[`q[${k}]`] = v;
    return memo;
  }, {});

  return {
    getList: (resource, params) => {
      const { page = 0, perPage = 10 } = params.pagination;
      const { field = 'id', order = 'ASC' } = params.sort;

      const query = {
        limit: perPage,
        sort: `${field} ${order.toLowerCase()}`,
        offset: (page - 1) * perPage,
        ...buildQs(params.filter)
      };

      const url = `${baseUrl}/${resource}?${stringify(query)}`;

      return fetchJson(url).then(({ headers, json }) => ({
        data: json[kebabToCamel(resource)],
        total: json.total
      }));
    },

    getOne: (resource, params) =>
    fetchJson(`${baseUrl}/${resource}/${params.id}`).then(({ json }) => ({
      data: json
    })),

    getMany: (resource, params) => {
      const query = {
        filter: JSON.stringify({ id: params.ids }),
      };
      const url = `${baseUrl}/${resource}?${stringify(query)}`;
      return fetchJson(url).then(({ json }) => ({ data: json }));
    },

    getManyReference: (resource, params) => {
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

    update: (resource, params) =>
    fetchJson(`${baseUrl}/${resource}/${params.id}`, {
      method: 'PUT',
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json })),

    updateMany: (resource, params) => {
      const query = {
        filter: JSON.stringify({ id: params.ids}),
      };
      return fetchJson(`${baseUrl}/${resource}?${stringify(query)}`, {
        method: 'PUT',
        body: JSON.stringify(params.data),
      }).then(({ json }) => ({ data: json }));
    },

    create: (resource, params) =>{
      return fetchJson(`${baseUrl}/${resource}`, {
        method: 'POST',
        body: JSON.stringify(params.data),
      }).then(({ json }) => ({
        data: { ...params.data, id: json.id },
      }))
    },

    delete: (resource, params) => {
      return fetchJson(`${baseUrl}/${resource}/${params.id}`, {
        method: 'DELETE',
      }).then(({ json }) => ({ data: json }));
    },

    deleteMany: (resource, params) => {
      return fetchJson(`${baseUrl}/${resource}/${params.ids[0]}`, {
        method: 'DELETE',
      }).then(({ json }) => ({ data: json }));
    }
  };
};

function kebabToCamel(s){
  return s.replace(/(-\w)/g, function(m){return m[1].toUpperCase();});
}