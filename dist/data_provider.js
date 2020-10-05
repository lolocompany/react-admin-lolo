"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactAdmin = require("react-admin");

var _queryString = require("query-string");

var _auth = _interopRequireDefault(require("@aws-amplify/auth"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = apiUrl => {
  const fetchJson = async (path, options = {}) => {
    if (!options.headers) {
      options.headers = new Headers({
        Accept: 'application/json'
      });
    }

    const session = await _auth.default.currentSession();
    options.headers.set('Authorization', session.idToken.jwtToken);
    return _reactAdmin.fetchUtils.fetchJson(apiUrl + path, options);
  };

  const buildQs = (filter = {}) => Object.entries(filter).reduce((memo, [k, v]) => {
    memo[`q[${k}]`] = v;
    return memo;
  }, {});

  const create = async (resource, params) => {
    const res = await fetchJson(`/${resource}`, {
      method: 'POST',
      body: JSON.stringify(params.data)
    });
    return {
      data: res.json
    };
  };

  return {
    /**
     * Custom request
     */
    sendRequest: async (path, options) => {
      const res = await fetchJson(path, options);
      return {
        data: res.json
      };
    },

    /**
     * getList 
     */
    getList: async (resource, params) => {
      const {
        page = 1,
        perPage = 10
      } = params.pagination || {};
      const {
        field = 'id',
        order = 'ASC'
      } = params.sort || {};
      const query = {
        limit: perPage,
        sort: `${field} ${order.toLowerCase()}`,
        offset: (page - 1) * perPage,
        ...buildQs(params.filter)
      };
      const url = `/${resource}?${(0, _queryString.stringify)(query)}`;
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
      const res = await fetchJson(`/${resource}/${params.id}`);
      return {
        data: res.json
      };
    },

    /**
     * getMany 
     */
    getMany: (resource, params) => {
      const query = params.ids.reduce((memo, id) => {
        return memo += `&q[id]=${id}`;
      }, `qor=1`);
      const url = `/${resource}?${query}`;
      return fetchJson(url).then(({
        headers,
        json
      }) => ({
        data: json[kebabToCamel(resource)],
        total: json.total
      }));
    },

    /**
     * getManyReference 
     */
    getManyReference: async (resource, params) => {
      const {
        page = 1,
        perPage = 10
      } = params.pagination || {};
      const {
        field = 'id',
        order = 'ASC'
      } = params.sort || {};
      const query = {
        limit: perPage,
        sort: `${field} ${order.toLowerCase()}`,
        offset: (page - 1) * perPage,
        ...buildQs({
          [params.target]: params.id
        })
      };
      const url = `/${resource}?${(0, _queryString.stringify)(query)}`;
      const res = await fetchJson(url);
      return {
        data: res.json[kebabToCamel(resource)],
        total: res.json.total
      };
    },

    /**
     * update 
     */
    update: (resource, params) => {
      return fetchJson(`/${resource}/${params.id}`, {
        method: 'PUT',
        body: JSON.stringify(params.data)
      }).then(res => {
        return {
          data: res.json
        };
      }).catch(err => {
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
        method: 'DELETE'
      }).then(() => ({
        data: resource
      }));
    },

    /**
     * deleteMany 
     */
    deleteMany: async (resource, params) => {
      const deletedIds = [];

      for (const id of params.ids) {
        const url = `/${resource}/${id}`;

        try {
          await fetchJson(url, {
            method: 'DELETE'
          });
          deletedIds.push(id);
        } catch (err) {
          console.log('delete error', err);
        }
      }

      return {
        data: deletedIds
      };
    }
  };
};

exports.default = _default;

function kebabToCamel(s) {
  return s.replace(/(-\w)/g, function (m) {
    return m[1].toUpperCase();
  });
}