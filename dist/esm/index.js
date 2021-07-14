import * as React from 'react';
import React__default, { useState, useEffect, useRef, useContext, cloneElement, Fragment } from 'react';
import * as ra from 'react-admin';
import { fetchUtils, useLogin, useRefresh, Logout, useDataProvider, CreateButton } from 'react-admin';
import { stringify } from 'query-string';
import inflection, { pluralize, camelize, humanize, transform, titleize, singularize, inflect } from 'inflection';
import Auth from '@aws-amplify/auth';
import Amplify, { Auth as Auth$1, Hub } from 'aws-amplify';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import { onAuthUIStateChange, AuthState } from '@aws-amplify/ui-components';
import { AmplifyAuthenticator, AmplifySignIn } from '@aws-amplify/ui-react';
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew';
import { makeStyles, List as List$1, ListSubheader, ListItem, Divider, Toolbar, Card, Box, Typography } from '@material-ui/core';
import { withRouter } from 'react-router';
import TextField$1 from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CreateIcon from '@material-ui/icons/CreateOutlined';
import '@material-ui/core/Typography';
import { withStyles, makeStyles as makeStyles$1 } from '@material-ui/core/styles';
import 'autosuggest-highlight/parse';
import ArrayField from '@rjsf/core/lib/components/fields/ArrayField';
import Form from '@rjsf/material-ui';
import { ImportButton as ImportButton$1 } from 'react-admin-import-csv';
import Inbox from '@material-ui/icons/Inbox';
import { useListContext, useTranslate } from 'ra-core';
import Popper from '@material-ui/core/Popper';
import ListSubheader$1 from '@material-ui/core/ListSubheader';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';
import { createSvgIcon, unstable_useId, useControlled, useEventCallback, setRef } from '@material-ui/core/utils';

function _extends$1() {
  _extends$1 = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$1.apply(this, arguments);
}

var _dataProvider = (apiUrl => {
  let getToken = async () => {
    const session = await Auth.currentSession();
    return session.idToken.jwtToken;
  };

  const fetchJson = async (path, options = {}) => {
    if (!options.headers) {
      options.headers = new Headers({
        Accept: 'application/json'
      });
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
        err.message = err.body.errors.map(item => {
          const field = humanize(item.dataPath.replace('.body.', ''));
          return `${field} ${item.message}`;
        }).join(', ');
      }

      throw err;
    });
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
     * API URL
     */
    apiUrl,

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
      const url = `/${resource}?${stringify(query)}`;
      const res = await fetchJson(url);
      pluralize(camelize(resource.replace(/-/g, ''), true));
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
        ...buildQs({ ...params.filter,
          [params.target]: params.id
        })
      };
      const url = `/${resource}?${stringify(query)}`;
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
    },

    /**
     * getToken
     */
    get getToken() {
      return getToken;
    },

    set getToken(fn) {
      getToken = fn;
    }

  };
});

function kebabToCamel(s) {
  return s.replace(/(-\w)/g, function (m) {
    return m[1].toUpperCase();
  });
}

Amplify.configure({
  Auth: {
    region: 'eu-west-1',
    userPoolId: 'eu-west-1_lQin10bBN',
    userPoolWebClientId: '2j7v5uee5qc13p6kncmlrjqq0q'
  }
});
let authProvider = {
  init: async updateAuth => {
    let token = null;
    token = await (async () => {
      try {
        const session = await Auth$1.currentSession();
        return session.idToken.jwtToken;
      } catch (e) {
        return null;
      }
    })();
    Hub.listen('auth', data => {
      const {
        payload: {
          event,
          data: {
            signInUserSession: {
              idToken: {
                jwtToken
              }
            }
          }
        }
      } = data;
      updateAuth(event === 'signIn' ? jwtToken : null);
    });
    updateAuth(token);
  },
  login: params => Promise.resolve(),
  logout: params => Auth$1.signOut(),
  checkAuth: params => Auth$1.currentSession(),
  checkError: error => Promise.resolve(),
  getPermissions: params => Promise.resolve()
};

class AuthProvider {
  constructor(options) {
    if (options) {
      authProvider = Object.assign(authProvider, options);
    }
  }

}

var i18nProvider = polyglotI18nProvider(locale => englishMessages, 'en', {
  allowMissing: true
});

const LoginPage = () => {
  const login = useLogin();
  React__default.useEffect(() => {
    onAuthUIStateChange(nextAuthState => {
      if (nextAuthState === AuthState.SignedIn) {
        login();
      }
    });
  }, []);
  return /*#__PURE__*/React__default.createElement("div", {
    className: "amplify-form-wrapper"
  }, /*#__PURE__*/React__default.createElement(AmplifyAuthenticator, null, /*#__PURE__*/React__default.createElement(AmplifySignIn, {
    slot: "sign-in",
    usernameAlias: "email",
    hideSignUp: true
  })));
};

function useAuth() {
  const [jwtToken, setJwtToken] = useState(null);
  useEffect(() => {
    authProvider.init(token => {
      setJwtToken(token);
    });
  }, []);
  return {
    jwtToken
  };
}

const AdminDataContext = /*#__PURE__*/React__default.createContext({});

function useAdminContext() {
  const context = React__default.useContext(AdminDataContext);

  if (!context) {
    throw new Error('useAdminContext must be used within AdminContext');
  }

  return context;
}

const defaultAccountsUrl = 'https://dev.lolo.company/api/accounts/all';

function AdminContext(props) {
  const {
    data
  } = props;
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const {
    jwtToken
  } = useAuth();
  useEffect(() => {
    const getAccounts = async () => {
      const headers = new Headers({
        Accept: 'application/json'
      });
      headers.set('Authorization', jwtToken);
      ra.fetchUtils.fetchJson(data.accountsUrl || defaultAccountsUrl, {
        headers
      }).then(({
        json
      }) => {
        setAccounts(json.accounts);
        setSelectedAccount(getSelectedAccount(json.accounts));
      }).catch(err => {
        if (err.status === 401) data.authProvider.logout();
        throw err;
      });
    };

    if (jwtToken) {
      getAccounts();
    }
  }, [jwtToken]);
  return /*#__PURE__*/React__default.createElement(AdminDataContext.Provider, {
    value: {
      accounts,
      selectedAccount,
      setSelectedAccount,
      ...data
    }
  }, props.children);
}

const getSelectedAccount = accounts => {
  if (accounts.length < 1) return null;
  const id = localStorage.getItem('accountId');
  const isPrimaryAccount = accounts.find(item => item.isPrimary);

  if (id) {
    return accounts.find(item => item.id === id) || null;
  } else {
    return isPrimaryAccount || accounts[0];
  }
};

const useStyles$3 = makeStyles(theme => ({
  dropdown: {
    width: 200,
    overflow: 'auto'
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}));

const AppBarDropdown = props => {
  const {
    accounts,
    selectedAccount,
    setSelectedAccount
  } = useAdminContext();
  const classes = useStyles$3();
  const refresh = useRefresh();

  const handleAccountSelect = account => {
    const selectedAcc = accounts.find(item => item.id === account.id);

    if (selectedAcc.isPrimary) {
      localStorage.removeItem('accountId');
    } else {
      localStorage.setItem('accountId', account.id);
    }

    refresh();
    setSelectedAccount(account);
  };

  const selectedAccountId = selectedAccount ? selectedAccount.id : '';
  return /*#__PURE__*/React__default.createElement("div", {
    className: classes.dropdown
  }, /*#__PURE__*/React__default.createElement(List$1, null, /*#__PURE__*/React__default.createElement(ListSubheader, null, "Accounts"), accounts.map((account, i) => /*#__PURE__*/React__default.createElement(ListItem, {
    key: i,
    button: true,
    value: account.id,
    selected: account.id === selectedAccountId,
    disabled: account.id === selectedAccountId,
    onClick: () => handleAccountSelect(account)
  }, account.name)), /*#__PURE__*/React__default.createElement("div", {
    className: classes.divider
  }, /*#__PURE__*/React__default.createElement(Divider, {
    light: true
  })), /*#__PURE__*/React__default.createElement(Logout, _extends$1({}, props, {
    icon: /*#__PURE__*/React__default.createElement(PowerSettingsNew, null)
  }))));
};

const Admin = ({
  fields = {},
  widgets = {},
  apiUrl,
  accountsUrl,
  ...props
}) => {
  const dataProvider = props.dataProvider || _dataProvider(apiUrl);

  if (props.authProvider) {
    new AuthProvider(props.authProvider);
  }

  const RAdmin = () => /*#__PURE__*/React__default.createElement(ra.Admin, _extends$1({
    dataProvider: dataProvider,
    authProvider: authProvider,
    i18nProvider: i18nProvider,
    loginPage: LoginPage,
    title: "Lolo Admin",
    logoutButton: AppBarDropdown
  }, props), props.children);

  return /*#__PURE__*/React__default.createElement(AdminContext, {
    data: {
      accountsUrl,
      authProvider,
      dataProvider,
      fields,
      widgets
    }
  }, /*#__PURE__*/React__default.createElement(RAdmin, null));
};

var traverse$2 = {exports: {}};

var traverse = traverse$2.exports = function (obj) {
    return new Traverse(obj);
};

function Traverse (obj) {
    this.value = obj;
}

Traverse.prototype.get = function (ps) {
    var node = this.value;
    for (var i = 0; i < ps.length; i ++) {
        var key = ps[i];
        if (!node || !hasOwnProperty.call(node, key)) {
            node = undefined;
            break;
        }
        node = node[key];
    }
    return node;
};

Traverse.prototype.has = function (ps) {
    var node = this.value;
    for (var i = 0; i < ps.length; i ++) {
        var key = ps[i];
        if (!node || !hasOwnProperty.call(node, key)) {
            return false;
        }
        node = node[key];
    }
    return true;
};

Traverse.prototype.set = function (ps, value) {
    var node = this.value;
    for (var i = 0; i < ps.length - 1; i ++) {
        var key = ps[i];
        if (!hasOwnProperty.call(node, key)) node[key] = {};
        node = node[key];
    }
    node[ps[i]] = value;
    return value;
};

Traverse.prototype.map = function (cb) {
    return walk(this.value, cb, true);
};

Traverse.prototype.forEach = function (cb) {
    this.value = walk(this.value, cb, false);
    return this.value;
};

Traverse.prototype.reduce = function (cb, init) {
    var skip = arguments.length === 1;
    var acc = skip ? this.value : init;
    this.forEach(function (x) {
        if (!this.isRoot || !skip) {
            acc = cb.call(this, acc, x);
        }
    });
    return acc;
};

Traverse.prototype.paths = function () {
    var acc = [];
    this.forEach(function (x) {
        acc.push(this.path); 
    });
    return acc;
};

Traverse.prototype.nodes = function () {
    var acc = [];
    this.forEach(function (x) {
        acc.push(this.node);
    });
    return acc;
};

Traverse.prototype.clone = function () {
    var parents = [], nodes = [];
    
    return (function clone (src) {
        for (var i = 0; i < parents.length; i++) {
            if (parents[i] === src) {
                return nodes[i];
            }
        }
        
        if (typeof src === 'object' && src !== null) {
            var dst = copy(src);
            
            parents.push(src);
            nodes.push(dst);
            
            forEach(objectKeys(src), function (key) {
                dst[key] = clone(src[key]);
            });
            
            parents.pop();
            nodes.pop();
            return dst;
        }
        else {
            return src;
        }
    })(this.value);
};

function walk (root, cb, immutable) {
    var path = [];
    var parents = [];
    var alive = true;
    
    return (function walker (node_) {
        var node = immutable ? copy(node_) : node_;
        var modifiers = {};
        
        var keepGoing = true;
        
        var state = {
            node : node,
            node_ : node_,
            path : [].concat(path),
            parent : parents[parents.length - 1],
            parents : parents,
            key : path.slice(-1)[0],
            isRoot : path.length === 0,
            level : path.length,
            circular : null,
            update : function (x, stopHere) {
                if (!state.isRoot) {
                    state.parent.node[state.key] = x;
                }
                state.node = x;
                if (stopHere) keepGoing = false;
            },
            'delete' : function (stopHere) {
                delete state.parent.node[state.key];
                if (stopHere) keepGoing = false;
            },
            remove : function (stopHere) {
                if (isArray(state.parent.node)) {
                    state.parent.node.splice(state.key, 1);
                }
                else {
                    delete state.parent.node[state.key];
                }
                if (stopHere) keepGoing = false;
            },
            keys : null,
            before : function (f) { modifiers.before = f; },
            after : function (f) { modifiers.after = f; },
            pre : function (f) { modifiers.pre = f; },
            post : function (f) { modifiers.post = f; },
            stop : function () { alive = false; },
            block : function () { keepGoing = false; }
        };
        
        if (!alive) return state;
        
        function updateState() {
            if (typeof state.node === 'object' && state.node !== null) {
                if (!state.keys || state.node_ !== state.node) {
                    state.keys = objectKeys(state.node);
                }
                
                state.isLeaf = state.keys.length == 0;
                
                for (var i = 0; i < parents.length; i++) {
                    if (parents[i].node_ === node_) {
                        state.circular = parents[i];
                        break;
                    }
                }
            }
            else {
                state.isLeaf = true;
                state.keys = null;
            }
            
            state.notLeaf = !state.isLeaf;
            state.notRoot = !state.isRoot;
        }
        
        updateState();
        
        // use return values to update if defined
        var ret = cb.call(state, state.node);
        if (ret !== undefined && state.update) state.update(ret);
        
        if (modifiers.before) modifiers.before.call(state, state.node);
        
        if (!keepGoing) return state;
        
        if (typeof state.node == 'object'
        && state.node !== null && !state.circular) {
            parents.push(state);
            
            updateState();
            
            forEach(state.keys, function (key, i) {
                path.push(key);
                
                if (modifiers.pre) modifiers.pre.call(state, state.node[key], key);
                
                var child = walker(state.node[key]);
                if (immutable && hasOwnProperty.call(state.node, key)) {
                    state.node[key] = child.node;
                }
                
                child.isLast = i == state.keys.length - 1;
                child.isFirst = i == 0;
                
                if (modifiers.post) modifiers.post.call(state, child);
                
                path.pop();
            });
            parents.pop();
        }
        
        if (modifiers.after) modifiers.after.call(state, state.node);
        
        return state;
    })(root).node;
}

function copy (src) {
    if (typeof src === 'object' && src !== null) {
        var dst;
        
        if (isArray(src)) {
            dst = [];
        }
        else if (isDate(src)) {
            dst = new Date(src.getTime ? src.getTime() : src);
        }
        else if (isRegExp(src)) {
            dst = new RegExp(src);
        }
        else if (isError(src)) {
            dst = { message: src.message };
        }
        else if (isBoolean(src)) {
            dst = new Boolean(src);
        }
        else if (isNumber(src)) {
            dst = new Number(src);
        }
        else if (isString(src)) {
            dst = new String(src);
        }
        else if (Object.create && Object.getPrototypeOf) {
            dst = Object.create(Object.getPrototypeOf(src));
        }
        else if (src.constructor === Object) {
            dst = {};
        }
        else {
            var proto =
                (src.constructor && src.constructor.prototype)
                || src.__proto__
                || {}
            ;
            var T = function () {};
            T.prototype = proto;
            dst = new T;
        }
        
        forEach(objectKeys(src), function (key) {
            dst[key] = src[key];
        });
        return dst;
    }
    else return src;
}

var objectKeys = Object.keys || function keys (obj) {
    var res = [];
    for (var key in obj) res.push(key);
    return res;
};

function toS (obj) { return Object.prototype.toString.call(obj) }
function isDate (obj) { return toS(obj) === '[object Date]' }
function isRegExp (obj) { return toS(obj) === '[object RegExp]' }
function isError (obj) { return toS(obj) === '[object Error]' }
function isBoolean (obj) { return toS(obj) === '[object Boolean]' }
function isNumber (obj) { return toS(obj) === '[object Number]' }
function isString (obj) { return toS(obj) === '[object String]' }

var isArray = Array.isArray || function isArray (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};

var forEach = function (xs, fn) {
    if (xs.forEach) return xs.forEach(fn)
    else for (var i = 0; i < xs.length; i++) {
        fn(xs[i], i, xs);
    }
};

forEach(objectKeys(Traverse.prototype), function (key) {
    traverse[key] = function (obj) {
        var args = [].slice.call(arguments, 1);
        var t = new Traverse(obj);
        return t[key].apply(t, args);
    };
});

var hasOwnProperty = Object.hasOwnProperty || function (obj, key) {
    return key in obj;
};

var traverse$1 = traverse$2.exports;

const CreateActions = ({
  basePath,
  resource
}) => /*#__PURE__*/React__default.createElement(ra.TopToolbar, null, /*#__PURE__*/React__default.createElement(ra.ListButton, {
  basePath: basePath,
  resource: resource
}));

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ReactPropTypesSecret$1 = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

var ReactPropTypesSecret_1 = ReactPropTypesSecret$1;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ReactPropTypesSecret = ReactPropTypesSecret_1;

function emptyFunction() {}
function emptyFunctionWithReset() {}
emptyFunctionWithReset.resetWarningCache = emptyFunction;

var factoryWithThrowingShims = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    var err = new Error(
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
    err.name = 'Invariant Violation';
    throw err;
  }  shim.isRequired = shim;
  function getShim() {
    return shim;
  }  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    elementType: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,

    checkPropTypes: emptyFunctionWithReset,
    resetWarningCache: emptyFunction
  };

  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

{
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  factoryWithThrowingShims();
}

function toVal(mix) {
	var k, y, str='';

	if (typeof mix === 'string' || typeof mix === 'number') {
		str += mix;
	} else if (typeof mix === 'object') {
		if (Array.isArray(mix)) {
			for (k=0; k < mix.length; k++) {
				if (mix[k]) {
					if (y = toVal(mix[k])) {
						str && (str += ' ');
						str += y;
					}
				}
			}
		} else {
			for (k in mix) {
				if (mix[k]) {
					str && (str += ' ');
					str += k;
				}
			}
		}
	}

	return str;
}

function clsx () {
	var i=0, tmp, x, str='';
	while (i < arguments.length) {
		if (tmp = arguments[i++]) {
			if (x = toVal(tmp)) {
				str && (str += ' ');
				str += x;
			}
		}
	}
	return str;
}

/**
 * @ignore - internal component.
 */

var CloseIcon = createSvgIcon( /*#__PURE__*/React.createElement("path", {
  d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
}), 'Close');

/**
 * @ignore - internal component.
 */

var ArrowDropDownIcon = createSvgIcon( /*#__PURE__*/React.createElement("path", {
  d: "M7 10l5 5 5-5z"
}), 'ArrowDropDown');

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

// Give up on IE 11 support for this feature

function stripDiacritics(string) {
  return typeof string.normalize !== 'undefined' ? string.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : string;
}

function createFilterOptions() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _config$ignoreAccents = config.ignoreAccents,
      ignoreAccents = _config$ignoreAccents === void 0 ? true : _config$ignoreAccents,
      _config$ignoreCase = config.ignoreCase,
      ignoreCase = _config$ignoreCase === void 0 ? true : _config$ignoreCase,
      limit = config.limit,
      _config$matchFrom = config.matchFrom,
      matchFrom = _config$matchFrom === void 0 ? 'any' : _config$matchFrom,
      stringify = config.stringify,
      _config$trim = config.trim,
      trim = _config$trim === void 0 ? false : _config$trim;
  return function (options, _ref) {
    var inputValue = _ref.inputValue,
        getOptionLabel = _ref.getOptionLabel;
    var input = trim ? inputValue.trim() : inputValue;

    if (ignoreCase) {
      input = input.toLowerCase();
    }

    if (ignoreAccents) {
      input = stripDiacritics(input);
    }

    var filteredOptions = options.filter(function (option) {
      var candidate = (stringify || getOptionLabel)(option);

      if (ignoreCase) {
        candidate = candidate.toLowerCase();
      }

      if (ignoreAccents) {
        candidate = stripDiacritics(candidate);
      }

      return matchFrom === 'start' ? candidate.indexOf(input) === 0 : candidate.indexOf(input) > -1;
    });
    return typeof limit === 'number' ? filteredOptions.slice(0, limit) : filteredOptions;
  };
} // To replace with .findIndex() once we stop IE 11 support.

function findIndex(array, comp) {
  for (var i = 0; i < array.length; i += 1) {
    if (comp(array[i])) {
      return i;
    }
  }

  return -1;
}

var defaultFilterOptions = createFilterOptions(); // Number of options to jump in list box when pageup and pagedown keys are used.

var pageSize = 5;
function useAutocomplete(props) {
  var _props$autoComplete = props.autoComplete,
      autoComplete = _props$autoComplete === void 0 ? false : _props$autoComplete,
      _props$autoHighlight = props.autoHighlight,
      autoHighlight = _props$autoHighlight === void 0 ? false : _props$autoHighlight,
      _props$autoSelect = props.autoSelect,
      autoSelect = _props$autoSelect === void 0 ? false : _props$autoSelect,
      _props$blurOnSelect = props.blurOnSelect,
      blurOnSelect = _props$blurOnSelect === void 0 ? false : _props$blurOnSelect,
      _props$clearOnBlur = props.clearOnBlur,
      clearOnBlur = _props$clearOnBlur === void 0 ? !props.freeSolo : _props$clearOnBlur,
      _props$clearOnEscape = props.clearOnEscape,
      clearOnEscape = _props$clearOnEscape === void 0 ? false : _props$clearOnEscape,
      _props$componentName = props.componentName,
      componentName = _props$componentName === void 0 ? 'useAutocomplete' : _props$componentName,
      _props$debug = props.debug,
      debug = _props$debug === void 0 ? false : _props$debug,
      _props$defaultValue = props.defaultValue,
      defaultValue = _props$defaultValue === void 0 ? props.multiple ? [] : null : _props$defaultValue,
      _props$disableClearab = props.disableClearable,
      disableClearable = _props$disableClearab === void 0 ? false : _props$disableClearab,
      _props$disableCloseOn = props.disableCloseOnSelect,
      disableCloseOnSelect = _props$disableCloseOn === void 0 ? false : _props$disableCloseOn,
      _props$disabledItemsF = props.disabledItemsFocusable,
      disabledItemsFocusable = _props$disabledItemsF === void 0 ? false : _props$disabledItemsF,
      _props$disableListWra = props.disableListWrap,
      disableListWrap = _props$disableListWra === void 0 ? false : _props$disableListWra,
      _props$filterOptions = props.filterOptions,
      filterOptions = _props$filterOptions === void 0 ? defaultFilterOptions : _props$filterOptions,
      _props$filterSelected = props.filterSelectedOptions,
      filterSelectedOptions = _props$filterSelected === void 0 ? false : _props$filterSelected,
      _props$freeSolo = props.freeSolo,
      freeSolo = _props$freeSolo === void 0 ? false : _props$freeSolo,
      getOptionDisabled = props.getOptionDisabled,
      _props$getOptionLabel = props.getOptionLabel,
      getOptionLabelProp = _props$getOptionLabel === void 0 ? function (option) {
    return option;
  } : _props$getOptionLabel,
      _props$getOptionSelec = props.getOptionSelected,
      getOptionSelected = _props$getOptionSelec === void 0 ? function (option, value) {
    return option === value;
  } : _props$getOptionSelec,
      groupBy = props.groupBy,
      _props$handleHomeEndK = props.handleHomeEndKeys,
      handleHomeEndKeys = _props$handleHomeEndK === void 0 ? !props.freeSolo : _props$handleHomeEndK,
      idProp = props.id,
      _props$includeInputIn = props.includeInputInList,
      includeInputInList = _props$includeInputIn === void 0 ? false : _props$includeInputIn,
      inputValueProp = props.inputValue,
      _props$multiple = props.multiple,
      multiple = _props$multiple === void 0 ? false : _props$multiple,
      onChange = props.onChange,
      onClose = props.onClose,
      onHighlightChange = props.onHighlightChange,
      onInputChange = props.onInputChange,
      onOpen = props.onOpen,
      openProp = props.open,
      _props$openOnFocus = props.openOnFocus,
      openOnFocus = _props$openOnFocus === void 0 ? false : _props$openOnFocus,
      options = props.options,
      _props$selectOnFocus = props.selectOnFocus,
      selectOnFocus = _props$selectOnFocus === void 0 ? !props.freeSolo : _props$selectOnFocus,
      valueProp = props.value;
  var id = unstable_useId(idProp);
  var getOptionLabel = getOptionLabelProp;

  var ignoreFocus = React.useRef(false);
  var firstFocus = React.useRef(true);
  var inputRef = React.useRef(null);
  var listboxRef = React.useRef(null);

  var _React$useState = React.useState(null),
      anchorEl = _React$useState[0],
      setAnchorEl = _React$useState[1];

  var _React$useState2 = React.useState(-1),
      focusedTag = _React$useState2[0],
      setFocusedTag = _React$useState2[1];

  var defaultHighlighted = autoHighlight ? 0 : -1;
  var highlightedIndexRef = React.useRef(defaultHighlighted);

  var _useControlled = useControlled({
    controlled: valueProp,
    default: defaultValue,
    name: componentName
  }),
      _useControlled2 = _slicedToArray(_useControlled, 2),
      value = _useControlled2[0],
      setValue = _useControlled2[1];

  var _useControlled3 = useControlled({
    controlled: inputValueProp,
    default: '',
    name: componentName,
    state: 'inputValue'
  }),
      _useControlled4 = _slicedToArray(_useControlled3, 2),
      inputValue = _useControlled4[0],
      setInputValue = _useControlled4[1];

  var _React$useState3 = React.useState(false),
      focused = _React$useState3[0],
      setFocused = _React$useState3[1];

  var resetInputValue = useEventCallback(function (event, newValue) {
    var newInputValue;

    if (multiple) {
      newInputValue = '';
    } else if (newValue == null) {
      newInputValue = '';
    } else {
      var optionLabel = getOptionLabel(newValue);
      newInputValue = typeof optionLabel === 'string' ? optionLabel : '';
    }

    if (inputValue === newInputValue) {
      return;
    }

    setInputValue(newInputValue);

    if (onInputChange) {
      onInputChange(event, newInputValue, 'reset');
    }
  });
  React.useEffect(function () {
    resetInputValue(null, value);
  }, [value, resetInputValue]);

  var _useControlled5 = useControlled({
    controlled: openProp,
    default: false,
    name: componentName,
    state: 'open'
  }),
      _useControlled6 = _slicedToArray(_useControlled5, 2),
      open = _useControlled6[0],
      setOpenState = _useControlled6[1];

  var inputValueIsSelectedValue = !multiple && value != null && inputValue === getOptionLabel(value);
  var popupOpen = open;
  var filteredOptions = popupOpen ? filterOptions(options.filter(function (option) {
    if (filterSelectedOptions && (multiple ? value : [value]).some(function (value2) {
      return value2 !== null && getOptionSelected(option, value2);
    })) {
      return false;
    }

    return true;
  }), // we use the empty string to manipulate `filterOptions` to not filter any options
  // i.e. the filter predicate always returns true
  {
    inputValue: inputValueIsSelectedValue ? '' : inputValue,
    getOptionLabel: getOptionLabel
  }) : [];

  var focusTag = useEventCallback(function (tagToFocus) {
    if (tagToFocus === -1) {
      inputRef.current.focus();
    } else {
      anchorEl.querySelector("[data-tag-index=\"".concat(tagToFocus, "\"]")).focus();
    }
  }); // Ensure the focusedTag is never inconsistent

  React.useEffect(function () {
    if (multiple && focusedTag > value.length - 1) {
      setFocusedTag(-1);
      focusTag(-1);
    }
  }, [value, multiple, focusedTag, focusTag]);

  function validOptionIndex(index, direction) {
    if (!listboxRef.current || index === -1) {
      return -1;
    }

    var nextFocus = index;

    while (true) {
      // Out of range
      if (direction === 'next' && nextFocus === filteredOptions.length || direction === 'previous' && nextFocus === -1) {
        return -1;
      }

      var option = listboxRef.current.querySelector("[data-option-index=\"".concat(nextFocus, "\"]")); // Same logic as MenuList.js

      var nextFocusDisabled = disabledItemsFocusable ? false : option && (option.disabled || option.getAttribute('aria-disabled') === 'true');

      if (option && !option.hasAttribute('tabindex') || nextFocusDisabled) {
        // Move to the next element.
        nextFocus += direction === 'next' ? 1 : -1;
      } else {
        return nextFocus;
      }
    }
  }

  var setHighlightedIndex = useEventCallback(function (_ref2) {
    var event = _ref2.event,
        index = _ref2.index,
        _ref2$reason = _ref2.reason,
        reason = _ref2$reason === void 0 ? 'auto' : _ref2$reason;
    highlightedIndexRef.current = index; // does the index exist?

    if (index === -1) {
      inputRef.current.removeAttribute('aria-activedescendant');
    } else {
      inputRef.current.setAttribute('aria-activedescendant', "".concat(id, "-option-").concat(index));
    }

    if (onHighlightChange) {
      onHighlightChange(event, index === -1 ? null : filteredOptions[index], reason);
    }

    if (!listboxRef.current) {
      return;
    }

    var prev = listboxRef.current.querySelector('[data-focus]');

    if (prev) {
      prev.removeAttribute('data-focus');
    }

    var listboxNode = listboxRef.current.parentElement.querySelector('[role="listbox"]'); // "No results"

    if (!listboxNode) {
      return;
    }

    if (index === -1) {
      listboxNode.scrollTop = 0;
      return;
    }

    var option = listboxRef.current.querySelector("[data-option-index=\"".concat(index, "\"]"));

    if (!option) {
      return;
    }

    option.setAttribute('data-focus', 'true'); // Scroll active descendant into view.
    // Logic copied from https://www.w3.org/TR/wai-aria-practices/examples/listbox/js/listbox.js
    //
    // Consider this API instead once it has a better browser support:
    // .scrollIntoView({ scrollMode: 'if-needed', block: 'nearest' });

    if (listboxNode.scrollHeight > listboxNode.clientHeight && reason !== 'mouse') {
      var element = option;
      var scrollBottom = listboxNode.clientHeight + listboxNode.scrollTop;
      var elementBottom = element.offsetTop + element.offsetHeight;

      if (elementBottom > scrollBottom) {
        listboxNode.scrollTop = elementBottom - listboxNode.clientHeight;
      } else if (element.offsetTop - element.offsetHeight * (groupBy ? 1.3 : 0) < listboxNode.scrollTop) {
        listboxNode.scrollTop = element.offsetTop - element.offsetHeight * (groupBy ? 1.3 : 0);
      }
    }
  });
  var changeHighlightedIndex = useEventCallback(function (_ref3) {
    var event = _ref3.event,
        diff = _ref3.diff,
        _ref3$direction = _ref3.direction,
        direction = _ref3$direction === void 0 ? 'next' : _ref3$direction,
        _ref3$reason = _ref3.reason,
        reason = _ref3$reason === void 0 ? 'auto' : _ref3$reason;

    if (!popupOpen) {
      return;
    }

    var getNextIndex = function getNextIndex() {
      var maxIndex = filteredOptions.length - 1;

      if (diff === 'reset') {
        return defaultHighlighted;
      }

      if (diff === 'start') {
        return 0;
      }

      if (diff === 'end') {
        return maxIndex;
      }

      var newIndex = highlightedIndexRef.current + diff;

      if (newIndex < 0) {
        if (newIndex === -1 && includeInputInList) {
          return -1;
        }

        if (disableListWrap && highlightedIndexRef.current !== -1 || Math.abs(diff) > 1) {
          return 0;
        }

        return maxIndex;
      }

      if (newIndex > maxIndex) {
        if (newIndex === maxIndex + 1 && includeInputInList) {
          return -1;
        }

        if (disableListWrap || Math.abs(diff) > 1) {
          return maxIndex;
        }

        return 0;
      }

      return newIndex;
    };

    var nextIndex = validOptionIndex(getNextIndex(), direction);
    setHighlightedIndex({
      index: nextIndex,
      reason: reason,
      event: event
    }); // Sync the content of the input with the highlighted option.

    if (autoComplete && diff !== 'reset') {
      if (nextIndex === -1) {
        inputRef.current.value = inputValue;
      } else {
        var option = getOptionLabel(filteredOptions[nextIndex]);
        inputRef.current.value = option; // The portion of the selected suggestion that has not been typed by the user,
        // a completion string, appears inline after the input cursor in the textbox.

        var index = option.toLowerCase().indexOf(inputValue.toLowerCase());

        if (index === 0 && inputValue.length > 0) {
          inputRef.current.setSelectionRange(inputValue.length, option.length);
        }
      }
    }
  });
  var syncHighlightedIndex = React.useCallback(function () {
    if (!popupOpen) {
      return;
    }

    var valueItem = multiple ? value[0] : value; // The popup is empty, reset

    if (filteredOptions.length === 0 || valueItem == null) {
      changeHighlightedIndex({
        diff: 'reset'
      });
      return;
    }

    if (!listboxRef.current) {
      return;
    } // Synchronize the value with the highlighted index


    if (!filterSelectedOptions && valueItem != null) {
      var currentOption = filteredOptions[highlightedIndexRef.current]; // Keep the current highlighted index if possible

      if (multiple && currentOption && findIndex(value, function (val) {
        return getOptionSelected(currentOption, val);
      }) !== -1) {
        return;
      }

      var itemIndex = findIndex(filteredOptions, function (optionItem) {
        return getOptionSelected(optionItem, valueItem);
      });

      if (itemIndex === -1) {
        changeHighlightedIndex({
          diff: 'reset'
        });
      } else {
        setHighlightedIndex({
          index: itemIndex
        });
      }

      return;
    } // Prevent the highlighted index to leak outside the boundaries.


    if (highlightedIndexRef.current >= filteredOptions.length - 1) {
      setHighlightedIndex({
        index: filteredOptions.length - 1
      });
      return;
    } // Restore the focus to the previous index.


    setHighlightedIndex({
      index: highlightedIndexRef.current
    }); // Ignore filteredOptions (and options, getOptionSelected, getOptionLabel) not to break the scroll position
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [// Only sync the highlighted index when the option switch between empty and not
  // eslint-disable-next-line react-hooks/exhaustive-deps
  filteredOptions.length === 0, // Don't sync the highlighted index with the value when multiple
  // eslint-disable-next-line react-hooks/exhaustive-deps
  multiple ? false : value, filterSelectedOptions, changeHighlightedIndex, setHighlightedIndex, popupOpen, inputValue, multiple]);
  var handleListboxRef = useEventCallback(function (node) {
    setRef(listboxRef, node);

    if (!node) {
      return;
    }

    syncHighlightedIndex();
  });
  React.useEffect(function () {
    syncHighlightedIndex();
  }, [syncHighlightedIndex]);

  var handleOpen = function handleOpen(event) {
    if (open) {
      return;
    }

    setOpenState(true);

    if (onOpen) {
      onOpen(event);
    }
  };

  var handleClose = function handleClose(event, reason) {
    if (!open) {
      return;
    }

    setOpenState(false);

    if (onClose) {
      onClose(event, reason);
    }
  };

  var handleValue = function handleValue(event, newValue, reason, details) {
    if (value === newValue) {
      return;
    }

    if (onChange) {
      onChange(event, newValue, reason, details);
    }

    setValue(newValue);
  };

  var isTouch = React.useRef(false);

  var selectNewValue = function selectNewValue(event, option) {
    var reasonProp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'select-option';
    var origin = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'options';
    var reason = reasonProp;
    var newValue = option;

    if (multiple) {
      newValue = Array.isArray(value) ? value.slice() : [];

      var itemIndex = findIndex(newValue, function (valueItem) {
        return getOptionSelected(option, valueItem);
      });

      if (itemIndex === -1) {
        newValue.push(option);
      } else if (origin !== 'freeSolo') {
        newValue.splice(itemIndex, 1);
        reason = 'remove-option';
      }
    }

    resetInputValue(event, newValue);
    handleValue(event, newValue, reason, {
      option: option
    });

    if (!disableCloseOnSelect) {
      handleClose(event, reason);
    }

    if (blurOnSelect === true || blurOnSelect === 'touch' && isTouch.current || blurOnSelect === 'mouse' && !isTouch.current) {
      inputRef.current.blur();
    }
  };

  function validTagIndex(index, direction) {
    if (index === -1) {
      return -1;
    }

    var nextFocus = index;

    while (true) {
      // Out of range
      if (direction === 'next' && nextFocus === value.length || direction === 'previous' && nextFocus === -1) {
        return -1;
      }

      var option = anchorEl.querySelector("[data-tag-index=\"".concat(nextFocus, "\"]")); // Same logic as MenuList.js

      if (option && (!option.hasAttribute('tabindex') || option.disabled || option.getAttribute('aria-disabled') === 'true')) {
        nextFocus += direction === 'next' ? 1 : -1;
      } else {
        return nextFocus;
      }
    }
  }

  var handleFocusTag = function handleFocusTag(event, direction) {
    if (!multiple) {
      return;
    }

    handleClose(event, 'toggleInput');
    var nextTag = focusedTag;

    if (focusedTag === -1) {
      if (inputValue === '' && direction === 'previous') {
        nextTag = value.length - 1;
      }
    } else {
      nextTag += direction === 'next' ? 1 : -1;

      if (nextTag < 0) {
        nextTag = 0;
      }

      if (nextTag === value.length) {
        nextTag = -1;
      }
    }

    nextTag = validTagIndex(nextTag, direction);
    setFocusedTag(nextTag);
    focusTag(nextTag);
  };

  var handleClear = function handleClear(event) {
    ignoreFocus.current = true;
    setInputValue('');

    if (onInputChange) {
      onInputChange(event, '', 'clear');
    }

    handleValue(event, multiple ? [] : null, 'clear');
  };

  var handleKeyDown = function handleKeyDown(other) {
    return function (event) {
      if (focusedTag !== -1 && ['ArrowLeft', 'ArrowRight'].indexOf(event.key) === -1) {
        setFocusedTag(-1);
        focusTag(-1);
      }

      switch (event.key) {
        case 'Home':
          if (popupOpen && handleHomeEndKeys) {
            // Prevent scroll of the page
            event.preventDefault();
            changeHighlightedIndex({
              diff: 'start',
              direction: 'next',
              reason: 'keyboard',
              event: event
            });
          }

          break;

        case 'End':
          if (popupOpen && handleHomeEndKeys) {
            // Prevent scroll of the page
            event.preventDefault();
            changeHighlightedIndex({
              diff: 'end',
              direction: 'previous',
              reason: 'keyboard',
              event: event
            });
          }

          break;

        case 'PageUp':
          // Prevent scroll of the page
          event.preventDefault();
          changeHighlightedIndex({
            diff: -pageSize,
            direction: 'previous',
            reason: 'keyboard',
            event: event
          });
          handleOpen(event);
          break;

        case 'PageDown':
          // Prevent scroll of the page
          event.preventDefault();
          changeHighlightedIndex({
            diff: pageSize,
            direction: 'next',
            reason: 'keyboard',
            event: event
          });
          handleOpen(event);
          break;

        case 'ArrowDown':
          // Prevent cursor move
          event.preventDefault();
          changeHighlightedIndex({
            diff: 1,
            direction: 'next',
            reason: 'keyboard',
            event: event
          });
          handleOpen(event);
          break;

        case 'ArrowUp':
          // Prevent cursor move
          event.preventDefault();
          changeHighlightedIndex({
            diff: -1,
            direction: 'previous',
            reason: 'keyboard',
            event: event
          });
          handleOpen(event);
          break;

        case 'ArrowLeft':
          handleFocusTag(event, 'previous');
          break;

        case 'ArrowRight':
          handleFocusTag(event, 'next');
          break;

        case 'Enter':
          // Wait until IME is settled.
          if (event.which === 229) {
            break;
          }

          if (highlightedIndexRef.current !== -1 && popupOpen) {
            var option = filteredOptions[highlightedIndexRef.current];
            var disabled = getOptionDisabled ? getOptionDisabled(option) : false; // We don't want to validate the form.

            event.preventDefault();

            if (disabled) {
              return;
            }

            selectNewValue(event, option, 'select-option'); // Move the selection to the end.

            if (autoComplete) {
              inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
            }
          } else if (freeSolo && inputValue !== '' && inputValueIsSelectedValue === false) {
            if (multiple) {
              // Allow people to add new values before they submit the form.
              event.preventDefault();
            }

            selectNewValue(event, inputValue, 'create-option', 'freeSolo');
          }

          break;

        case 'Escape':
          if (popupOpen) {
            // Avoid Opera to exit fullscreen mode.
            event.preventDefault(); // Avoid the Modal to handle the event.

            event.stopPropagation();
            handleClose(event, 'escape');
          } else if (clearOnEscape && (inputValue !== '' || multiple && value.length > 0)) {
            // Avoid Opera to exit fullscreen mode.
            event.preventDefault(); // Avoid the Modal to handle the event.

            event.stopPropagation();
            handleClear(event);
          }

          break;

        case 'Backspace':
          if (multiple && inputValue === '' && value.length > 0) {
            var index = focusedTag === -1 ? value.length - 1 : focusedTag;
            var newValue = value.slice();
            newValue.splice(index, 1);
            handleValue(event, newValue, 'remove-option', {
              option: value[index]
            });
          }

          break;
      }

      if (other.onKeyDown) {
        other.onKeyDown(event);
      }
    };
  };

  var handleFocus = function handleFocus(event) {
    setFocused(true);

    if (openOnFocus && !ignoreFocus.current) {
      handleOpen(event);
    }
  };

  var handleBlur = function handleBlur(event) {
    // Ignore the event when using the scrollbar with IE 11
    if (listboxRef.current !== null && document.activeElement === listboxRef.current.parentElement) {
      inputRef.current.focus();
      return;
    }

    setFocused(false);
    firstFocus.current = true;
    ignoreFocus.current = false;

    if (debug && inputValue !== '') {
      return;
    }

    if (autoSelect && highlightedIndexRef.current !== -1 && popupOpen) {
      selectNewValue(event, filteredOptions[highlightedIndexRef.current], 'blur');
    } else if (autoSelect && freeSolo && inputValue !== '') {
      selectNewValue(event, inputValue, 'blur', 'freeSolo');
    } else if (clearOnBlur) {
      resetInputValue(event, value);
    }

    handleClose(event, 'blur');
  };

  var handleInputChange = function handleInputChange(event) {
    var newValue = event.target.value;

    if (inputValue !== newValue) {
      setInputValue(newValue);

      if (onInputChange) {
        onInputChange(event, newValue, 'input');
      }
    }

    if (newValue === '') {
      if (!disableClearable && !multiple) {
        handleValue(event, null, 'clear');
      }
    } else {
      handleOpen(event);
    }
  };

  var handleOptionMouseOver = function handleOptionMouseOver(event) {
    setHighlightedIndex({
      event: event,
      index: Number(event.currentTarget.getAttribute('data-option-index')),
      reason: 'mouse'
    });
  };

  var handleOptionTouchStart = function handleOptionTouchStart() {
    isTouch.current = true;
  };

  var handleOptionClick = function handleOptionClick(event) {
    var index = Number(event.currentTarget.getAttribute('data-option-index'));
    selectNewValue(event, filteredOptions[index], 'select-option');
    isTouch.current = false;
  };

  var handleTagDelete = function handleTagDelete(index) {
    return function (event) {
      var newValue = value.slice();
      newValue.splice(index, 1);
      handleValue(event, newValue, 'remove-option', {
        option: value[index]
      });
    };
  };

  var handlePopupIndicator = function handlePopupIndicator(event) {
    if (open) {
      handleClose(event, 'toggleInput');
    } else {
      handleOpen(event);
    }
  }; // Prevent input blur when interacting with the combobox


  var handleMouseDown = function handleMouseDown(event) {
    if (event.target.getAttribute('id') !== id) {
      event.preventDefault();
    }
  }; // Focus the input when interacting with the combobox


  var handleClick = function handleClick() {
    inputRef.current.focus();

    if (selectOnFocus && firstFocus.current && inputRef.current.selectionEnd - inputRef.current.selectionStart === 0) {
      inputRef.current.select();
    }

    firstFocus.current = false;
  };

  var handleInputMouseDown = function handleInputMouseDown(event) {
    if (inputValue === '' || !open) {
      handlePopupIndicator(event);
    }
  };

  var dirty = freeSolo && inputValue.length > 0;
  dirty = dirty || (multiple ? value.length > 0 : value !== null);
  var groupedOptions = filteredOptions;

  if (groupBy) {
    groupedOptions = filteredOptions.reduce(function (acc, option, index) {
      var group = groupBy(option);

      if (acc.length > 0 && acc[acc.length - 1].group === group) {
        acc[acc.length - 1].options.push(option);
      } else {

        acc.push({
          key: index,
          index: index,
          group: group,
          options: [option]
        });
      }

      return acc;
    }, []);
  }

  return {
    getRootProps: function getRootProps() {
      var other = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return _extends({
        'aria-owns': popupOpen ? "".concat(id, "-popup") : null,
        role: 'combobox',
        'aria-expanded': popupOpen
      }, other, {
        onKeyDown: handleKeyDown(other),
        onMouseDown: handleMouseDown,
        onClick: handleClick
      });
    },
    getInputLabelProps: function getInputLabelProps() {
      return {
        id: "".concat(id, "-label"),
        htmlFor: id
      };
    },
    getInputProps: function getInputProps() {
      return {
        id: id,
        value: inputValue,
        onBlur: handleBlur,
        onFocus: handleFocus,
        onChange: handleInputChange,
        onMouseDown: handleInputMouseDown,
        // if open then this is handled imperativeley so don't let react override
        // only have an opinion about this when closed
        'aria-activedescendant': popupOpen ? '' : null,
        'aria-autocomplete': autoComplete ? 'both' : 'list',
        'aria-controls': popupOpen ? "".concat(id, "-popup") : null,
        // Disable browser's suggestion that might overlap with the popup.
        // Handle autocomplete but not autofill.
        autoComplete: 'off',
        ref: inputRef,
        autoCapitalize: 'none',
        spellCheck: 'false'
      };
    },
    getClearProps: function getClearProps() {
      return {
        tabIndex: -1,
        onClick: handleClear
      };
    },
    getPopupIndicatorProps: function getPopupIndicatorProps() {
      return {
        tabIndex: -1,
        onClick: handlePopupIndicator
      };
    },
    getTagProps: function getTagProps(_ref4) {
      var index = _ref4.index;
      return {
        key: index,
        'data-tag-index': index,
        tabIndex: -1,
        onDelete: handleTagDelete(index)
      };
    },
    getListboxProps: function getListboxProps() {
      return {
        role: 'listbox',
        id: "".concat(id, "-popup"),
        'aria-labelledby': "".concat(id, "-label"),
        ref: handleListboxRef,
        onMouseDown: function onMouseDown(event) {
          // Prevent blur
          event.preventDefault();
        }
      };
    },
    getOptionProps: function getOptionProps(_ref5) {
      var index = _ref5.index,
          option = _ref5.option;
      var selected = (multiple ? value : [value]).some(function (value2) {
        return value2 != null && getOptionSelected(option, value2);
      });
      var disabled = getOptionDisabled ? getOptionDisabled(option) : false;
      return {
        key: index,
        tabIndex: -1,
        role: 'option',
        id: "".concat(id, "-option-").concat(index),
        onMouseOver: handleOptionMouseOver,
        onClick: handleOptionClick,
        onTouchStart: handleOptionTouchStart,
        'data-option-index': index,
        'aria-disabled': disabled,
        'aria-selected': selected
      };
    },
    id: id,
    inputValue: inputValue,
    value: value,
    dirty: dirty,
    popupOpen: popupOpen,
    focused: focused || focusedTag !== -1,
    anchorEl: anchorEl,
    setAnchorEl: setAnchorEl,
    focusedTag: focusedTag,
    groupedOptions: groupedOptions
  };
}

var styles = function styles(theme) {
  var _option;

  return {
    /* Styles applied to the root element. */
    root: {
      '&$focused $clearIndicatorDirty': {
        visibility: 'visible'
      },

      /* Avoid double tap issue on iOS */
      '@media (pointer: fine)': {
        '&:hover $clearIndicatorDirty': {
          visibility: 'visible'
        }
      }
    },

    /* Styles applied to the root element if `fullWidth={true}`. */
    fullWidth: {
      width: '100%'
    },

    /* Pseudo-class applied to the root element if focused. */
    focused: {},

    /* Styles applied to the tag elements, e.g. the chips. */
    tag: {
      margin: 3,
      maxWidth: 'calc(100% - 6px)'
    },

    /* Styles applied to the tag elements, e.g. the chips if `size="small"`. */
    tagSizeSmall: {
      margin: 2,
      maxWidth: 'calc(100% - 4px)'
    },

    /* Styles applied when the popup icon is rendered. */
    hasPopupIcon: {},

    /* Styles applied when the clear icon is rendered. */
    hasClearIcon: {},

    /* Styles applied to the Input element. */
    inputRoot: {
      flexWrap: 'wrap',
      '$hasPopupIcon &, $hasClearIcon &': {
        paddingRight: 26 + 4
      },
      '$hasPopupIcon$hasClearIcon &': {
        paddingRight: 52 + 4
      },
      '& $input': {
        width: 0,
        minWidth: 30
      },
      '&[class*="MuiInput-root"]': {
        paddingBottom: 1,
        '& $input': {
          padding: 4
        },
        '& $input:first-child': {
          padding: '6px 0'
        }
      },
      '&[class*="MuiInput-root"][class*="MuiInput-marginDense"]': {
        '& $input': {
          padding: '4px 4px 5px'
        },
        '& $input:first-child': {
          padding: '3px 0 6px'
        }
      },
      '&[class*="MuiOutlinedInput-root"]': {
        padding: 9,
        '$hasPopupIcon &, $hasClearIcon &': {
          paddingRight: 26 + 4 + 9
        },
        '$hasPopupIcon$hasClearIcon &': {
          paddingRight: 52 + 4 + 9
        },
        '& $input': {
          padding: '9.5px 4px'
        },
        '& $input:first-child': {
          paddingLeft: 6
        },
        '& $endAdornment': {
          right: 9
        }
      },
      '&[class*="MuiOutlinedInput-root"][class*="MuiOutlinedInput-marginDense"]': {
        padding: 6,
        '& $input': {
          padding: '4.5px 4px'
        }
      },
      '&[class*="MuiFilledInput-root"]': {
        paddingTop: 19,
        paddingLeft: 8,
        '$hasPopupIcon &, $hasClearIcon &': {
          paddingRight: 26 + 4 + 9
        },
        '$hasPopupIcon$hasClearIcon &': {
          paddingRight: 52 + 4 + 9
        },
        '& $input': {
          padding: '9px 4px'
        },
        '& $endAdornment': {
          right: 9
        }
      },
      '&[class*="MuiFilledInput-root"][class*="MuiFilledInput-marginDense"]': {
        paddingBottom: 1,
        '& $input': {
          padding: '4.5px 4px'
        }
      }
    },

    /* Styles applied to the input element. */
    input: {
      flexGrow: 1,
      textOverflow: 'ellipsis',
      opacity: 0
    },

    /* Styles applied to the input element if tag focused. */
    inputFocused: {
      opacity: 1
    },

    /* Styles applied to the endAdornment element. */
    endAdornment: {
      // We use a position absolute to support wrapping tags.
      position: 'absolute',
      right: 0,
      top: 'calc(50% - 14px)' // Center vertically

    },

    /* Styles applied to the clear indicator. */
    clearIndicator: {
      marginRight: -2,
      padding: 4,
      visibility: 'hidden'
    },

    /* Styles applied to the clear indicator if the input is dirty. */
    clearIndicatorDirty: {},

    /* Styles applied to the popup indicator. */
    popupIndicator: {
      padding: 2,
      marginRight: -2
    },

    /* Styles applied to the popup indicator if the popup is open. */
    popupIndicatorOpen: {
      transform: 'rotate(180deg)'
    },

    /* Styles applied to the popper element. */
    popper: {
      zIndex: theme.zIndex.modal
    },

    /* Styles applied to the popper element if `disablePortal={true}`. */
    popperDisablePortal: {
      position: 'absolute'
    },

    /* Styles applied to the `Paper` component. */
    paper: _extends({}, theme.typography.body1, {
      overflow: 'hidden',
      margin: '4px 0'
    }),

    /* Styles applied to the `listbox` component. */
    listbox: {
      listStyle: 'none',
      margin: 0,
      padding: '8px 0',
      maxHeight: '40vh',
      overflow: 'auto'
    },

    /* Styles applied to the loading wrapper. */
    loading: {
      color: theme.palette.text.secondary,
      padding: '14px 16px'
    },

    /* Styles applied to the no option wrapper. */
    noOptions: {
      color: theme.palette.text.secondary,
      padding: '14px 16px'
    },

    /* Styles applied to the option elements. */
    option: (_option = {
      minHeight: 48,
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      cursor: 'pointer',
      paddingTop: 6,
      boxSizing: 'border-box',
      outline: '0',
      WebkitTapHighlightColor: 'transparent',
      paddingBottom: 6,
      paddingLeft: 16,
      paddingRight: 16
    }, _defineProperty(_option, theme.breakpoints.up('sm'), {
      minHeight: 'auto'
    }), _defineProperty(_option, '&[aria-selected="true"]', {
      backgroundColor: theme.palette.action.selected
    }), _defineProperty(_option, '&[data-focus="true"]', {
      backgroundColor: theme.palette.action.hover
    }), _defineProperty(_option, '&:active', {
      backgroundColor: theme.palette.action.selected
    }), _defineProperty(_option, '&[aria-disabled="true"]', {
      opacity: theme.palette.action.disabledOpacity,
      pointerEvents: 'none'
    }), _option),

    /* Styles applied to the group's label elements. */
    groupLabel: {
      backgroundColor: theme.palette.background.paper,
      top: -8
    },

    /* Styles applied to the group's ul elements. */
    groupUl: {
      padding: 0,
      '& $option': {
        paddingLeft: 24
      }
    }
  };
};

function DisablePortal(props) {
  // eslint-disable-next-line react/prop-types
  props.anchorEl;
      props.open;
      var other = _objectWithoutProperties(props, ["anchorEl", "open"]);

  return /*#__PURE__*/React.createElement("div", other);
}

var _ref = /*#__PURE__*/React.createElement(CloseIcon, {
  fontSize: "small"
});

var _ref2 = /*#__PURE__*/React.createElement(ArrowDropDownIcon, null);

var Autocomplete = /*#__PURE__*/React.forwardRef(function Autocomplete(props, ref) {
  /* eslint-disable no-unused-vars */
  props.autoComplete;
      props.autoHighlight;
      props.autoSelect;
      props.blurOnSelect;
      var ChipProps = props.ChipProps,
      classes = props.classes,
      className = props.className,
      _props$clearOnBlur = props.clearOnBlur;
      _props$clearOnBlur === void 0 ? !props.freeSolo : _props$clearOnBlur;
      props.clearOnEscape;
      var _props$clearText = props.clearText,
      clearText = _props$clearText === void 0 ? 'Clear' : _props$clearText,
      _props$closeIcon = props.closeIcon,
      closeIcon = _props$closeIcon === void 0 ? _ref : _props$closeIcon,
      _props$closeText = props.closeText,
      closeText = _props$closeText === void 0 ? 'Close' : _props$closeText;
      props.debug;
      var _props$defaultValue = props.defaultValue;
      _props$defaultValue === void 0 ? props.multiple ? [] : null : _props$defaultValue;
      var _props$disableClearab = props.disableClearable,
      disableClearable = _props$disableClearab === void 0 ? false : _props$disableClearab;
      props.disableCloseOnSelect;
      var _props$disabled = props.disabled,
      disabled = _props$disabled === void 0 ? false : _props$disabled;
      props.disabledItemsFocusable;
      props.disableListWrap;
      var _props$disablePortal = props.disablePortal,
      disablePortal = _props$disablePortal === void 0 ? false : _props$disablePortal;
      props.filterOptions;
      props.filterSelectedOptions;
      var _props$forcePopupIcon = props.forcePopupIcon,
      forcePopupIcon = _props$forcePopupIcon === void 0 ? 'auto' : _props$forcePopupIcon,
      _props$freeSolo = props.freeSolo,
      freeSolo = _props$freeSolo === void 0 ? false : _props$freeSolo,
      _props$fullWidth = props.fullWidth,
      fullWidth = _props$fullWidth === void 0 ? false : _props$fullWidth,
      _props$getLimitTagsTe = props.getLimitTagsText,
      getLimitTagsText = _props$getLimitTagsTe === void 0 ? function (more) {
    return "+".concat(more);
  } : _props$getLimitTagsTe;
      props.getOptionDisabled;
      var _props$getOptionLabel = props.getOptionLabel,
      getOptionLabel = _props$getOptionLabel === void 0 ? function (x) {
    return x;
  } : _props$getOptionLabel;
      props.getOptionSelected;
      var groupBy = props.groupBy,
      _props$handleHomeEndK = props.handleHomeEndKeys;
      _props$handleHomeEndK === void 0 ? !props.freeSolo : _props$handleHomeEndK;
      props.id;
      props.includeInputInList;
      props.inputValue;
      var _props$limitTags = props.limitTags,
      limitTags = _props$limitTags === void 0 ? -1 : _props$limitTags,
      _props$ListboxCompone = props.ListboxComponent,
      ListboxComponent = _props$ListboxCompone === void 0 ? 'ul' : _props$ListboxCompone,
      ListboxProps = props.ListboxProps,
      _props$loading = props.loading,
      loading = _props$loading === void 0 ? false : _props$loading,
      _props$loadingText = props.loadingText,
      loadingText = _props$loadingText === void 0 ? 'Loading…' : _props$loadingText,
      _props$multiple = props.multiple,
      multiple = _props$multiple === void 0 ? false : _props$multiple,
      _props$noOptionsText = props.noOptionsText,
      noOptionsText = _props$noOptionsText === void 0 ? 'No options' : _props$noOptionsText;
      props.onChange;
      props.onClose;
      props.onHighlightChange;
      props.onInputChange;
      props.onOpen;
      props.open;
      props.openOnFocus;
      var _props$openText = props.openText,
      openText = _props$openText === void 0 ? 'Open' : _props$openText;
      props.options;
      var _props$PaperComponent = props.PaperComponent,
      PaperComponent = _props$PaperComponent === void 0 ? Paper : _props$PaperComponent,
      _props$PopperComponen = props.PopperComponent,
      PopperComponentProp = _props$PopperComponen === void 0 ? Popper : _props$PopperComponen,
      _props$popupIcon = props.popupIcon,
      popupIcon = _props$popupIcon === void 0 ? _ref2 : _props$popupIcon,
      renderGroupProp = props.renderGroup,
      renderInput = props.renderInput,
      renderOptionProp = props.renderOption,
      renderTags = props.renderTags,
      _props$selectOnFocus = props.selectOnFocus;
      _props$selectOnFocus === void 0 ? !props.freeSolo : _props$selectOnFocus;
      var _props$size = props.size,
      size = _props$size === void 0 ? 'medium' : _props$size;
      props.value;
      var other = _objectWithoutProperties(props, ["autoComplete", "autoHighlight", "autoSelect", "blurOnSelect", "ChipProps", "classes", "className", "clearOnBlur", "clearOnEscape", "clearText", "closeIcon", "closeText", "debug", "defaultValue", "disableClearable", "disableCloseOnSelect", "disabled", "disabledItemsFocusable", "disableListWrap", "disablePortal", "filterOptions", "filterSelectedOptions", "forcePopupIcon", "freeSolo", "fullWidth", "getLimitTagsText", "getOptionDisabled", "getOptionLabel", "getOptionSelected", "groupBy", "handleHomeEndKeys", "id", "includeInputInList", "inputValue", "limitTags", "ListboxComponent", "ListboxProps", "loading", "loadingText", "multiple", "noOptionsText", "onChange", "onClose", "onHighlightChange", "onInputChange", "onOpen", "open", "openOnFocus", "openText", "options", "PaperComponent", "PopperComponent", "popupIcon", "renderGroup", "renderInput", "renderOption", "renderTags", "selectOnFocus", "size", "value"]);
  /* eslint-enable no-unused-vars */


  var PopperComponent = disablePortal ? DisablePortal : PopperComponentProp;

  var _useAutocomplete = useAutocomplete(_extends({}, props, {
    componentName: 'Autocomplete'
  })),
      getRootProps = _useAutocomplete.getRootProps,
      getInputProps = _useAutocomplete.getInputProps,
      getInputLabelProps = _useAutocomplete.getInputLabelProps,
      getPopupIndicatorProps = _useAutocomplete.getPopupIndicatorProps,
      getClearProps = _useAutocomplete.getClearProps,
      getTagProps = _useAutocomplete.getTagProps,
      getListboxProps = _useAutocomplete.getListboxProps,
      getOptionProps = _useAutocomplete.getOptionProps,
      value = _useAutocomplete.value,
      dirty = _useAutocomplete.dirty,
      id = _useAutocomplete.id,
      popupOpen = _useAutocomplete.popupOpen,
      focused = _useAutocomplete.focused,
      focusedTag = _useAutocomplete.focusedTag,
      anchorEl = _useAutocomplete.anchorEl,
      setAnchorEl = _useAutocomplete.setAnchorEl,
      inputValue = _useAutocomplete.inputValue,
      groupedOptions = _useAutocomplete.groupedOptions;

  var startAdornment;

  if (multiple && value.length > 0) {
    var getCustomizedTagProps = function getCustomizedTagProps(params) {
      return _extends({
        className: clsx(classes.tag, size === 'small' && classes.tagSizeSmall),
        disabled: disabled
      }, getTagProps(params));
    };

    if (renderTags) {
      startAdornment = renderTags(value, getCustomizedTagProps);
    } else {
      startAdornment = value.map(function (option, index) {
        return /*#__PURE__*/React.createElement(Chip, _extends({
          label: getOptionLabel(option),
          size: size
        }, getCustomizedTagProps({
          index: index
        }), ChipProps));
      });
    }
  }

  if (limitTags > -1 && Array.isArray(startAdornment)) {
    var more = startAdornment.length - limitTags;

    if (!focused && more > 0) {
      startAdornment = startAdornment.splice(0, limitTags);
      startAdornment.push( /*#__PURE__*/React.createElement("span", {
        className: classes.tag,
        key: startAdornment.length
      }, getLimitTagsText(more)));
    }
  }

  var defaultRenderGroup = function defaultRenderGroup(params) {
    return /*#__PURE__*/React.createElement("li", {
      key: params.key
    }, /*#__PURE__*/React.createElement(ListSubheader$1, {
      className: classes.groupLabel,
      component: "div"
    }, params.group), /*#__PURE__*/React.createElement("ul", {
      className: classes.groupUl
    }, params.children));
  };

  var renderGroup = renderGroupProp || defaultRenderGroup;
  var renderOption = renderOptionProp || getOptionLabel;

  var renderListOption = function renderListOption(option, index) {
    var optionProps = getOptionProps({
      option: option,
      index: index
    });
    return /*#__PURE__*/React.createElement("li", _extends({}, optionProps, {
      className: classes.option
    }), renderOption(option, {
      selected: optionProps['aria-selected'],
      inputValue: inputValue
    }));
  };

  var hasClearIcon = !disableClearable && !disabled;
  var hasPopupIcon = (!freeSolo || forcePopupIcon === true) && forcePopupIcon !== false;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", _extends({
    ref: ref,
    className: clsx(classes.root, className, focused && classes.focused, fullWidth && classes.fullWidth, hasClearIcon && classes.hasClearIcon, hasPopupIcon && classes.hasPopupIcon)
  }, getRootProps(other)), renderInput({
    id: id,
    disabled: disabled,
    fullWidth: true,
    size: size === 'small' ? 'small' : undefined,
    InputLabelProps: getInputLabelProps(),
    InputProps: {
      ref: setAnchorEl,
      className: classes.inputRoot,
      startAdornment: startAdornment,
      endAdornment: /*#__PURE__*/React.createElement("div", {
        className: classes.endAdornment
      }, hasClearIcon ? /*#__PURE__*/React.createElement(IconButton, _extends({}, getClearProps(), {
        "aria-label": clearText,
        title: clearText,
        className: clsx(classes.clearIndicator, dirty && classes.clearIndicatorDirty)
      }), closeIcon) : null, hasPopupIcon ? /*#__PURE__*/React.createElement(IconButton, _extends({}, getPopupIndicatorProps(), {
        disabled: disabled,
        "aria-label": popupOpen ? closeText : openText,
        title: popupOpen ? closeText : openText,
        className: clsx(classes.popupIndicator, popupOpen && classes.popupIndicatorOpen)
      }), popupIcon) : null)
    },
    inputProps: _extends({
      className: clsx(classes.input, focusedTag === -1 && classes.inputFocused),
      disabled: disabled
    }, getInputProps())
  })), popupOpen && anchorEl ? /*#__PURE__*/React.createElement(PopperComponent, {
    className: clsx(classes.popper, disablePortal && classes.popperDisablePortal),
    style: {
      width: anchorEl ? anchorEl.clientWidth : null
    },
    role: "presentation",
    anchorEl: anchorEl,
    open: true
  }, /*#__PURE__*/React.createElement(PaperComponent, {
    className: classes.paper
  }, loading && groupedOptions.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: classes.loading
  }, loadingText) : null, groupedOptions.length === 0 && !freeSolo && !loading ? /*#__PURE__*/React.createElement("div", {
    className: classes.noOptions
  }, noOptionsText) : null, groupedOptions.length > 0 ? /*#__PURE__*/React.createElement(ListboxComponent, _extends({
    className: classes.listbox
  }, getListboxProps(), ListboxProps), groupedOptions.map(function (option, index) {
    if (groupBy) {
      return renderGroup({
        key: option.key,
        group: option.group,
        children: option.options.map(function (option2, index2) {
          return renderListOption(option2, option.index + index2);
        })
      });
    }

    return renderListOption(option, index);
  })) : null)) : null);
});
var Autocomplete$1 = withStyles(styles, {
  name: 'MuiAutocomplete'
})(Autocomplete);

/* eslint-disable no-undefined,no-param-reassign,no-shadow */

/**
 * Throttle execution of a function. Especially useful for rate limiting
 * execution of handlers on events like resize and scroll.
 *
 * @param  {number}    delay -          A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 * @param  {boolean}   [noTrailing] -   Optional, defaults to false. If noTrailing is true, callback will only execute every `delay` milliseconds while the
 *                                    throttled-function is being called. If noTrailing is false or unspecified, callback will be executed one final time
 *                                    after the last throttled-function call. (After the throttled-function has not been called for `delay` milliseconds,
 *                                    the internal counter is reset).
 * @param  {Function}  callback -       A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
 *                                    to `callback` when the throttled-function is executed.
 * @param  {boolean}   [debounceMode] - If `debounceMode` is true (at begin), schedule `clear` to execute after `delay` ms. If `debounceMode` is false (at end),
 *                                    schedule `callback` to execute after `delay` ms.
 *
 * @returns {Function}  A new, throttled, function.
 */
function throttle (delay, noTrailing, callback, debounceMode) {
  /*
   * After wrapper has stopped being called, this timeout ensures that
   * `callback` is executed at the proper times in `throttle` and `end`
   * debounce modes.
   */
  var timeoutID;
  var cancelled = false; // Keep track of the last time `callback` was executed.

  var lastExec = 0; // Function to clear existing timeout

  function clearExistingTimeout() {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
  } // Function to cancel next exec


  function cancel() {
    clearExistingTimeout();
    cancelled = true;
  } // `noTrailing` defaults to falsy.


  if (typeof noTrailing !== 'boolean') {
    debounceMode = callback;
    callback = noTrailing;
    noTrailing = undefined;
  }
  /*
   * The `wrapper` function encapsulates all of the throttling / debouncing
   * functionality and when executed will limit the rate at which `callback`
   * is executed.
   */


  function wrapper() {
    for (var _len = arguments.length, arguments_ = new Array(_len), _key = 0; _key < _len; _key++) {
      arguments_[_key] = arguments[_key];
    }

    var self = this;
    var elapsed = Date.now() - lastExec;

    if (cancelled) {
      return;
    } // Execute `callback` and update the `lastExec` timestamp.


    function exec() {
      lastExec = Date.now();
      callback.apply(self, arguments_);
    }
    /*
     * If `debounceMode` is true (at begin) this is used to clear the flag
     * to allow future `callback` executions.
     */


    function clear() {
      timeoutID = undefined;
    }

    if (debounceMode && !timeoutID) {
      /*
       * Since `wrapper` is being called for the first time and
       * `debounceMode` is true (at begin), execute `callback`.
       */
      exec();
    }

    clearExistingTimeout();

    if (debounceMode === undefined && elapsed > delay) {
      /*
       * In throttle mode, if `delay` time has been exceeded, execute
       * `callback`.
       */
      exec();
    } else if (noTrailing !== true) {
      /*
       * In trailing throttle mode, since `delay` time has not been
       * exceeded, schedule `callback` to execute `delay` ms after most
       * recent execution.
       *
       * If `debounceMode` is true (at begin), schedule `clear` to execute
       * after `delay` ms.
       *
       * If `debounceMode` is false (at end), schedule `callback` to
       * execute after `delay` ms.
       */
      timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === undefined ? delay - elapsed : delay);
    }
  }

  wrapper.cancel = cancel; // Return the wrapper function.

  return wrapper;
}

/* eslint-disable no-undefined */
/**
 * Debounce execution of a function. Debouncing, unlike throttling,
 * guarantees that a function is only executed a single time, either at the
 * very beginning of a series of calls, or at the very end.
 *
 * @param  {number}   delay -         A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 * @param  {boolean}  [atBegin] -     Optional, defaults to false. If atBegin is false or unspecified, callback will only be executed `delay` milliseconds
 *                                  after the last debounced-function call. If atBegin is true, callback will be executed only at the first debounced-function call.
 *                                  (After the throttled-function has not been called for `delay` milliseconds, the internal counter is reset).
 * @param  {Function} callback -      A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
 *                                  to `callback` when the debounced-function is executed.
 *
 * @returns {Function} A new, debounced function.
 */

function debounce (delay, atBegin, callback) {
  return callback === undefined ? throttle(delay, atBegin, false) : throttle(delay, callback, atBegin !== false);
}

const keyToRef = key => transform(key.replace(/Id$/, ''), ['underscore', 'dasherize', 'pluralize']);
/* HOCs for using either name or id as label */

const TextField = props => {
  const source = props.record.name ? 'name' : 'id';
  return /*#__PURE__*/React__default.createElement(ra.TextField, _extends$1({}, props, {
    source: source
  }));
};
const isEqual = (a, b) => {
  return JSON.stringify(a) === JSON.stringify(b);
};
const deepClone = value => {
  return JSON.parse(JSON.stringify(value));
};
const removeReadonly = json => {
  const {
    uiSchema = {},
    ...schema
  } = deepClone(json);
  traverse$1(schema).forEach(function () {
    if (this.key === 'readOnly' && this.node === true) {
      this.parent.remove();
    }
  });
  return {
    uiSchema,
    ...schema
  };
};

function useIsMountedRef() {
  const isMountedRef = useRef(null);
  useEffect(() => {
    isMountedRef.current = true;
    return () => isMountedRef.current = false;
  }, []);
  return isMountedRef;
}

const useStyles$2 = makeStyles$1(theme => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2)
  }
}));

function ReferenceInputWidget(props) {
  const {
    id,
    value,
    onChange,
    schema,
    variant,
    uiSchema,
    showCreate = true
  } = props;
  const [inputValue, setInputValue] = React__default.useState('');
  const [options, setOptions] = React__default.useState([]);
  const [loading, setLoading] = React__default.useState(false);
  const [findBy, setFindBy] = React__default.useState('name');
  const {
    dataProvider
  } = useAdminContext();
  const isMountedRef = useIsMountedRef();
  useStyles$2();
  const typeCamel = id.split('_').pop().replace(/Id$/, '');
  const typePlural = transform(typeCamel, ['underscore', 'dasherize', 'pluralize']);

  const getOptionsArray = arr => {
    return arr.map(v => ({
      id: v.id,
      value: v.name || v.id
    }));
  }; // TODO: handle readOnly


  const search = React__default.useMemo(() => debounce(500, async (filter, cb) => {
    if (isMountedRef.current) {
      setLoading(true);
      const res = await dataProvider.getList(typePlural, {
        filter,
        pagination: {
          perPage: 25
        }
      });
      setLoading(false); // Ugly hack for resources without a name field (createById)

      if (res.data.length && res.data.every(item => !item.name)) {
        setFindBy('id');
      }

      cb(res.data);
    }
  }), []);
  React__default.useEffect(() => {
    if (loading) {
      return;
    } else if (value) {
      const selectedOption = options.find(opt => opt.id === value);

      if (selectedOption) {
        setInputValue(selectedOption.value);
      } else {
        (async () => {
          setLoading(true);

          try {
            const res = await dataProvider.getOne(typePlural, {
              id: value
            });

            if (res && res.data) {
              setInputValue(res.data.name || res.data.id);
              setOptions(getOptionsArray([res.data]));
            }
          } catch (err) {
            console.error('getOne', typePlural, value, err.message);
          }

          setLoading(false);
        })();
      }
    } else {
      search({
        [findBy]: inputValue
      }, results => {
        setOptions(getOptionsArray(results));
      });
    }
  }, [value, inputValue, search]);
  return /*#__PURE__*/React__default.createElement(Grid, {
    container: true
  }, /*#__PURE__*/React__default.createElement(Grid, {
    item: true,
    xs: 11
  }, /*#__PURE__*/React__default.createElement(Autocomplete$1, {
    id: id,
    autoComplete: true,
    blurOnSelect: true,
    getOptionLabel: option => option.value || option,
    getOptionSelected: option => option && option.id === value,
    filterOptions: x => x,
    options: options,
    autoComplete: true,
    includeInputInList: true,
    filterSelectedOptions: true,
    value: inputValue,
    inputValue: inputValue,
    onChange: (event, newValue) => {
      if (newValue) {
        setInputValue(newValue.value);
        onChange(newValue.id);
      } else {
        setInputValue('');
        onChange(undefined);
      }
    },
    onInputChange: (event, newInputValue) => setInputValue(newInputValue),
    renderInput: params => /*#__PURE__*/React__default.createElement(TextField$1, _extends$1({}, params, {
      label: schema && schema.title || typePlural,
      style: {
        minWidth: 186,
        margin: 4
      },
      variant: variant,
      InputProps: { ...params.InputProps,
        endAdornment: /*#__PURE__*/React__default.createElement(React__default.Fragment, null, loading ? /*#__PURE__*/React__default.createElement(CircularProgress, {
          color: "inherit",
          size: 18
        }) : null, params.InputProps.endAdornment)
      }
    }))
  })), /*#__PURE__*/React__default.createElement(Grid, {
    item: true,
    xs: 1,
    align: "right"
  }, showCreate ? /*#__PURE__*/React__default.createElement(Button, {
    style: {
      marginTop: 16
    },
    title: `Create new ${transform(typeCamel, ['titleize'])}`,
    onClick: () => props.history.push(`/${typePlural}/create`)
  }, /*#__PURE__*/React__default.createElement(CreateIcon, null)) : null));
}

const ReferenceManyField = props => {
  const [items, setItems] = useState([]);
  const dataProvider = useDataProvider();
  const typeCamel = props.name.replace(/Ids$/, '');
  const typeCamelPlural = transform(typeCamel, ['pluralize']);
  const typeDashPlural = transform(typeCamelPlural, ['underscore', 'dasherize']);
  useEffect(() => {
    dataProvider.sendRequest('/' + typeDashPlural).then(res => setItems(res.data[typeCamelPlural]));
  }, [dataProvider]);
  props.schema.uniqueItems = true;
  props.schema.items.enum = items.map(item => item.id);
  props.schema.items.enumNames = items.map(item => item.name);
  return /*#__PURE__*/React__default.createElement(ArrayField, props);
};

const useStyles$1 = makeStyles$1(theme => ({
  toolbarStyle: {
    backgroundColor: theme.palette.grey[100],
    marginTop: theme.spacing(2)
  }
}));

const CustomToolbar = props => {
  const classes = useStyles$1();
  return /*#__PURE__*/React__default.createElement(Toolbar, {
    className: classes.toolbarStyle
  }, props.children);
};

const FormComponent = props => {
  const [formData, setFormData] = useState({});
  const [schemaState, setSchemaState] = useState({});
  const [hasErrors, setHasErrors] = useState(true);
  const {
    schema: schemaProp,
    controllerData = {}
  } = props;
  const {
    basePath,
    record,
    resource,
    save,
    saving
  } = controllerData;
  const {
    fields,
    widgets
  } = useContext(ResourceContext);
  const {
    uiSchema = {},
    ...schema
  } = schemaProp;
  let form;
  useEffect(() => setFormData(record), [record]);
  useEffect(() => {
    if (schema) {
      const {
        $id,
        ...restSchema
      } = schema;
      setSchemaState(restSchema);
    }
  }, [schemaProp]);

  function usePrevious(value) {
    const ref = useRef();

    if (!isEqual(ref.current, value)) {
      ref.current = value;
    }

    return ref.current;
  }

  useEffect(() => {
    if (form) {
      setHasErrors(!!form.state.errors.length);
    }
  }, usePrevious(form));
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(Card, null, /*#__PURE__*/React__default.createElement(Box, {
    px: 2,
    pb: 1
  }, /*#__PURE__*/React__default.createElement(Form, {
    ref: f => {
      form = f;
    },
    schema: schemaState || {},
    uiSchema: uiSchema,
    formData: formData,
    showErrorList: false,
    liveValidate: true,
    fields: fields,
    widgets: widgets,
    onChange: ({
      formData,
      errors
    }) => {
      setFormData(formData);
      setHasErrors(!!errors.length);
    }
  }, ' '))), /*#__PURE__*/React__default.createElement(CustomToolbar, null, /*#__PURE__*/React__default.createElement(Box, {
    display: "flex",
    justifyContent: "space-between",
    width: "100%"
  }, /*#__PURE__*/React__default.createElement(ra.SaveButton, {
    saving: saving,
    disabled: hasErrors,
    handleSubmitWithRedirect: () => save(formData)
  }), /*#__PURE__*/React__default.createElement(ra.DeleteButton, {
    record: record,
    basePath: basePath,
    resource: resource,
    undoable: false
  }))));
};

const Create = props => {
  const {
    createSchema
  } = useContext(ResourceContext);
  const controllerData = ra.useCreateController({ ...props
  });
  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(CreateActions, props), /*#__PURE__*/React__default.createElement(ra.TitleForRecord, {
    title: props.title,
    record: controllerData.record,
    defaultTitle: getTitle$1(createSchema.title || controllerData.resource)
  }), /*#__PURE__*/React__default.createElement(FormComponent, {
    controllerData: controllerData,
    schema: createSchema
  }));
};

const getTitle$1 = (resource = '') => {
  return 'Create ' + titleize(singularize(resource));
};

const EditActions = ({
  basePath,
  resource
}) => /*#__PURE__*/React__default.createElement(ra.TopToolbar, null, /*#__PURE__*/React__default.createElement(ra.ListButton, {
  basePath: basePath,
  resource: resource
}));

const Edit = props => {
  const {
    editSchema
  } = useContext(ResourceContext);
  const controllerData = ra.useEditController({ ...props,
    undoable: false
  });
  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(EditActions, props), /*#__PURE__*/React__default.createElement(ra.TitleForRecord, {
    title: props.title,
    record: controllerData.record,
    defaultTitle: getTitle(editSchema.title || controllerData.resource)
  }), /*#__PURE__*/React__default.createElement(FormComponent, {
    controllerData: controllerData,
    schema: editSchema
  }));
};

const getTitle = (resource = '') => {
  return 'Edit ' + titleize(singularize(resource));
};

var ImportButton = (props => {
  const {
    schema
  } = useContext(ResourceContext);
  if (!schema) return;
  return /*#__PURE__*/React__default.createElement(ImportButton$1, _extends$1({
    preCommitCallback: (action, data) => {
      /* Typecast properties based on schema */
      for (const record of data) {
        for (const [key, val] of Object.entries(record)) {
          const fieldSchema = schema.properties[key] || {};

          switch (fieldSchema.type) {
            case 'integer':
              record[key] = parseInt(val);
              break;

            case 'number':
              record[key] = parseFloat(val);
              break;

            case 'boolean':
              record[key] = JSON.parse(val);
              break;
          }
        }
      }

      return data;
    },
    postCommitCallback: report => {
      /* disable concurrency */
    }
  }, props));
});

const ListActions = props => {
  const {
    className,
    exporter,
    filters,
    maxResults,
    hasCreate,
    ...rest
  } = props;
  const {
    currentSort,
    resource,
    displayedFilters,
    filterValues,
    basePath,
    showFilter,
    total
  } = ra.useListContext();
  return /*#__PURE__*/React__default.createElement(ra.TopToolbar, _extends$1({
    className: className
  }, ra.sanitizeListRestProps(rest)), filters && /*#__PURE__*/cloneElement(filters, {
    resource,
    showFilter,
    displayedFilters,
    filterValues,
    context: 'button'
  }), hasCreate ? /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(ra.CreateButton, {
    basePath: basePath
  }), /*#__PURE__*/React__default.createElement(ImportButton, props)) : null, /*#__PURE__*/React__default.createElement(ra.ExportButton, {
    disabled: total === 0,
    resource: resource,
    sort: currentSort,
    filterValues: filterValues,
    maxResults: maxResults
  }));
};

const useStyles = makeStyles$1(theme => ({
  message: {
    textAlign: 'center',
    opacity: theme.palette.type === 'light' ? 0.5 : 0.8,
    margin: '0 1em',
    color: theme.palette.type === 'light' ? 'inherit' : theme.palette.text.primary
  },
  icon: {
    width: '9em',
    height: '9em'
  },
  toolbar: {
    textAlign: 'center',
    marginTop: '2em'
  }
}), {
  name: 'RaEmpty'
});

const Empty = props => {
  const {
    resource,
    basePath
  } = useListContext(props);
  const classes = useStyles(props);
  const translate = useTranslate();
  const resourceName = translate(`resources.${resource}.forcedCaseName`, {
    smart_count: 0,
    _: inflection.humanize(translate(`resources.${resource}.name`, {
      smart_count: 0,
      _: inflection.pluralize(resource)
    }), true)
  });
  const emptyMessage = translate('ra.page.empty', {
    name: resourceName
  });
  const inviteMessage = translate('ra.page.invite');
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: classes.message
  }, /*#__PURE__*/React.createElement(Inbox, {
    className: classes.icon
  }), /*#__PURE__*/React.createElement(Typography, {
    variant: "h4",
    paragraph: true
  }, translate(`resources.${resource}.empty`, {
    _: emptyMessage
  })), /*#__PURE__*/React.createElement(Typography, {
    variant: "body1"
  }, translate(`resources.${resource}.invite`, {
    _: inviteMessage
  }))), /*#__PURE__*/React.createElement("div", {
    className: classes.toolbar
  }, /*#__PURE__*/React.createElement(CreateButton, {
    variant: "contained",
    basePath: basePath
  }), /*#__PURE__*/React.createElement(ImportButton, props)));
};

const Filter = props => {
  return /*#__PURE__*/React__default.createElement(ra.Filter, props, Object.entries(props.schema.properties).map(toInput));
};

const toInput = ([key, fieldSchema]) => {
  const fieldProps = {
    label: fieldSchema.title,
    source: key,
    key
  };
  if (key.endsWith('Id')) return /*#__PURE__*/React__default.createElement(RefInput, fieldProps);
  if (fieldSchema.enum) return enumInput(fieldProps, fieldSchema);

  switch (fieldSchema.type) {
    case 'string':
      return /*#__PURE__*/React__default.createElement(ra.TextInput, fieldProps);

    case 'boolean':
      return /*#__PURE__*/React__default.createElement(ra.BooleanInput, fieldProps);

    case 'integer':
    case 'number':
      return /*#__PURE__*/React__default.createElement(ra.NumberInput, fieldProps);

    default:
      return null;
  }
};

const RefInput = ({
  source,
  label
}) => {
  const {
    setFilters,
    filterValues
  } = ra.useListContext();
  return /*#__PURE__*/React__default.createElement(ReferenceInputWidget, {
    id: source,
    schema: {
      title: label
    },
    onChange: value => {
      setFilters({ ...filterValues,
        [source]: value
      });
    },
    variant: "filled",
    value: filterValues[source],
    showCreate: false
  });
};

const enumInput = (fieldProps, fieldSchema) => {
  const {
    enum: _enum,
    enumNames = []
  } = fieldSchema;

  const choices = _enum.map((id, i) => ({
    id,
    name: enumNames[i] || id
  }));

  return /*#__PURE__*/React__default.createElement(ra.SelectInput, _extends$1({}, fieldProps, {
    choices: choices
  }));
};

const ExpandPanel = ({
  id,
  record,
  resource
}) => /*#__PURE__*/React__default.createElement("pre", {
  style: {
    fontSize: '1.1rem'
  }
}, JSON.stringify(record, null, 2));

const BulkActionButtons = props => /*#__PURE__*/React__default.createElement(Fragment, null, /*#__PURE__*/React__default.createElement(ra.BulkDeleteButton, props));

const List = props => {
  const {
    listSchema: schema
  } = useContext(ResourceContext);
  if (!Object.keys(schema).length) return null;
  return /*#__PURE__*/React__default.createElement(ra.List, _extends$1({}, props, {
    bulkActionButtons: props.hasEdit ? /*#__PURE__*/React__default.createElement(BulkActionButtons, null) : false,
    filters: /*#__PURE__*/React__default.createElement(Filter, {
      schema: schema
    }),
    actions: /*#__PURE__*/React__default.createElement(ListActions, null),
    empty: /*#__PURE__*/React__default.createElement(Empty, null),
    sort: {
      field: 'createdAt',
      order: 'ASC'
    },
    title: schema.title ? pluralize(schema.title) : undefined
  }), /*#__PURE__*/React__default.createElement(ra.Datagrid, {
    rowClick: props.hasShow ? 'show' : props.hasEdit ? 'edit' : null,
    expand: props.expand || /*#__PURE__*/React__default.createElement(ExpandPanel, null)
  }, Object.entries(schema.properties).map(toField)));
};

const toField = ([key, fieldSchema]) => {
  const fieldProps = {
    source: key,
    label: fieldSchema ? fieldSchema.title : '',
    key
  };
  if (key.endsWith('Id')) return refField(fieldProps);
  if (key.endsWith('Ids')) return refManyField(fieldProps);
  if (fieldSchema.enum) return enumField(fieldProps, fieldSchema);

  switch (fieldSchema.type) {
    case 'string':
      return fieldSchema.format === 'date-time' ? /*#__PURE__*/React__default.createElement(ra.DateField, _extends$1({}, fieldProps, {
        showTime: true
      })) : /*#__PURE__*/React__default.createElement(ra.TextField, fieldProps);

    case 'boolean':
      return /*#__PURE__*/React__default.createElement(ra.BooleanField, fieldProps);

    case 'integer':
    case 'number':
      return /*#__PURE__*/React__default.createElement(ra.NumberField, fieldProps);

    default:
      return null;
  }
};

const refField = ({
  key,
  ...props
}) => {
  return /*#__PURE__*/React__default.createElement(ra.ReferenceField, _extends$1({
    reference: keyToRef(key),
    key: key
  }, props), /*#__PURE__*/React__default.createElement(TextField, null));
};

const refManyField = ({
  key,
  label,
  ...props
}) => {
  return /*#__PURE__*/React__default.createElement(ra.FunctionField, {
    label: label,
    render: record => {
      const count = (record[key] || []).length;
      return `${count} ${inflect('items', count)}`;
    }
  });
};

const enumField = (fieldProps, fieldSchema) => {
  const {
    enum: _enum,
    enumNames = []
  } = fieldSchema;

  const choices = _enum.map((id, i) => ({
    id,
    name: enumNames[i] || id
  }));

  return /*#__PURE__*/React__default.createElement(ra.SelectField, _extends$1({}, fieldProps, {
    choices: choices,
    translateChoice: false
  }));
};

const ResourceContext = /*#__PURE__*/React__default.createContext();

const Resource = props => {
  const {
    name,
    intent,
    editSchemaTransform = schema => ({ ...schema
    }),
    createSchemaTransform = schema => ({ ...schema
    }),
    listSchemaTransform = schema => ({ ...schema
    })
  } = props;
  const [schema, setSchema] = useState({});
  const [editSchema, setEditSchema] = useState({});
  const [createSchema, setCreateSchema] = useState({});
  const [listSchema, setListSchema] = useState({});
  const {
    fields,
    widgets,
    selectedAccount
  } = useAdminContext();
  const dataProvider = ra.useDataProvider();
  useEffect(() => {
    if (intent !== 'route' || !selectedAccount || !dataProvider) return;
    dataProvider.sendRequest('/schemas/' + singularize(name)).then(({
      data: pristineSchema
    }) => {
      delete pristineSchema.additionalProperties;
      setSchema(pristineSchema);
      const writableSchema = enableWidgets(removeReadonly(pristineSchema));
      setEditSchema(editSchemaTransform(writableSchema, pristineSchema, selectedAccount));
      setCreateSchema(createSchemaTransform(writableSchema, pristineSchema, selectedAccount));
      setListSchema(buildListSchema(listSchemaTransform, writableSchema, pristineSchema, selectedAccount));
    });
  }, [name, selectedAccount, dataProvider]);
  return /*#__PURE__*/React__default.createElement(ResourceContext.Provider, {
    value: {
      schema,
      editSchema,
      createSchema,
      listSchema,
      fields,
      widgets
    }
  }, /*#__PURE__*/React__default.createElement(ra.Resource, _extends$1({
    list: List,
    create: Create,
    edit: Edit
  }, props)));
};

const oneOf = part => part === 'oneOf';

const enableWidgets = json => {
  const {
    uiSchema = {},
    ...schema
  } = deepClone(json);
  traverse$1(schema).forEach(function () {
    if (!/Ids?$/.test(this.key)) return;
    let path = this.path.filter(part => !['properties', 'dependencies'].includes(part));

    while (path.find(oneOf)) {
      path.splice(path.findIndex(oneOf) - 1, 3);
    }

    const schemaPatch = this.key.endsWith('s') ? {
      'ui:field': ReferenceManyField
    } : {
      'ui:widget': withRouter(ReferenceInputWidget)
    }; // Don't overwrite any existing uiSchema

    traverse$1(uiSchema).set(path, { ...schemaPatch,
      ...traverse$1(uiSchema).get(path)
    });
  });
  return {
    uiSchema,
    ...schema
  };
};

const buildListSchema = (listTransform, wrSchema, prSchema, selectedAccount) => {
  return listTransform({ ...wrSchema,
    properties: { ...wrSchema.properties,
      createdAt: prSchema.properties.createdAt
    }
  }, prSchema, selectedAccount);
};

const customlocalStorage = {
  setItem: (key, value) => {
    let event = new Event('localStorageItemUpdated');
    event.key = key;
    event.value = value;
    localStorage.setItem(key, value);
    window.dispatchEvent(event);
  },
  removeItem: key => {
    let event = new Event('localStorageItemUpdated');
    localStorage.removeItem(key);
    window.dispatchEvent(event);
  },
  getItem: key => {
    return localStorage.getItem(key);
  }
};

export { Admin as LoloAdmin, Create as LoloCreate, Edit as LoloEdit, List as LoloList, Resource as LoloResource, _dataProvider as dataProvider, customlocalStorage as localStorage, useAdminContext };
//# sourceMappingURL=index.js.map
