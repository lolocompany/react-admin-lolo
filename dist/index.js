'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var ra = require('react-admin');
var uiReact = require('@aws-amplify/ui-react');
var queryString = require('query-string');
var Auth = require('@aws-amplify/auth');
var awsAmplify = require('aws-amplify');
var core = require('@rjsf/core');
var materialUi = require('@rjsf/material-ui');
var core$1 = require('@material-ui/core');
var inflection = require('inflection');
var reactAdminImportCsv = require('react-admin-import-csv');
var Inbox = require('@material-ui/icons/Inbox');
var styles = require('@material-ui/core/styles');
var raCore = require('ra-core');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var Auth__default = /*#__PURE__*/_interopDefaultLegacy(Auth);
var inflection__default = /*#__PURE__*/_interopDefaultLegacy(inflection);
var Inbox__default = /*#__PURE__*/_interopDefaultLegacy(Inbox);

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
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

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

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

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
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

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = o[Symbol.iterator]();
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

var _dataProvider = (function (baseUrl) {
  var fetchJson = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url) {
      var options,
          session,
          _args = arguments;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};

              if (!options.headers) {
                options.headers = new Headers({
                  Accept: 'application/json'
                });
              }

              _context.next = 4;
              return Auth__default['default'].currentSession();

            case 4:
              session = _context.sent;
              options.headers.set('Authorization', session.idToken.jwtToken);
              return _context.abrupt("return", ra.fetchUtils.fetchJson(url, options));

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function fetchJson(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  var buildQs = function buildQs() {
    var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return Object.entries(filter).reduce(function (memo, _ref2) {
      var _ref3 = _slicedToArray(_ref2, 2),
          k = _ref3[0],
          v = _ref3[1];

      memo["q[".concat(k, "]")] = v;
      return memo;
    }, {});
  };

  var create = function create(resource, params) {
    console.log('dataProvider.create', resource, params);
    return fetchJson("".concat(baseUrl, "/").concat(resource), {
      method: 'POST',
      body: JSON.stringify(params.data)
    }).then(function (res) {
      return {
        data: res.json
      };
    });
  };

  return {
    /**
     * getList 
     */
    getList: function () {
      var _getList = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(resource, params) {
        var _ref4, _ref4$page, page, _ref4$perPage, perPage, _ref5, _ref5$field, field, _ref5$order, order, query, url, res;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _ref4 = params.pagination || {}, _ref4$page = _ref4.page, page = _ref4$page === void 0 ? 1 : _ref4$page, _ref4$perPage = _ref4.perPage, perPage = _ref4$perPage === void 0 ? 10 : _ref4$perPage;
                _ref5 = params.sort || {}, _ref5$field = _ref5.field, field = _ref5$field === void 0 ? 'id' : _ref5$field, _ref5$order = _ref5.order, order = _ref5$order === void 0 ? 'ASC' : _ref5$order;
                query = _objectSpread2({
                  limit: perPage,
                  sort: "".concat(field, " ").concat(order.toLowerCase()),
                  offset: (page - 1) * perPage
                }, buildQs(params.filter));
                url = "".concat(baseUrl, "/").concat(resource, "?").concat(queryString.stringify(query));
                _context2.next = 6;
                return fetchJson(url);

              case 6:
                res = _context2.sent;
                return _context2.abrupt("return", {
                  data: res.json[kebabToCamel(resource)],
                  total: res.json.total
                });

              case 8:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function getList(_x2, _x3) {
        return _getList.apply(this, arguments);
      }

      return getList;
    }(),

    /**
     * getOne 
     */
    getOne: function () {
      var _getOne = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(resource, params) {
        var res;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return fetchJson("".concat(baseUrl, "/").concat(resource, "/").concat(params.id));

              case 2:
                res = _context3.sent;
                return _context3.abrupt("return", {
                  data: res.json
                });

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function getOne(_x4, _x5) {
        return _getOne.apply(this, arguments);
      }

      return getOne;
    }(),

    /**
     * getMany 
     */
    getMany: function getMany(resource, params) {
      var query = params.ids.reduce(function (memo, id) {
        return memo += "&q[id]=".concat(id);
      }, "qor=1&_=".concat(Math.random()));
      var url = "".concat(baseUrl, "/").concat(resource, "?").concat(query);
      return fetchJson(url).then(function (_ref6) {
        var headers = _ref6.headers,
            json = _ref6.json;
        return {
          data: json[kebabToCamel(resource)],
          total: json.total
        };
      });
    },

    /**
     * getManyReference 
     */
    getManyReference: function getManyReference(resource, params) {
      console.log('getManyReference', resource, params);
      var _params$pagination = params.pagination,
          page = _params$pagination.page,
          perPage = _params$pagination.perPage;
      var _params$sort = params.sort,
          field = _params$sort.field,
          order = _params$sort.order;
      var query = {
        sort: JSON.stringify([field, order]),
        range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
        filter: JSON.stringify(_objectSpread2(_objectSpread2({}, params.filter), {}, _defineProperty({}, params.target, params.id)))
      };
      var url = "".concat(baseUrl, "/").concat(resource, "?").concat(queryString.stringify(query));
      return fetchJson(url).then(function (_ref7) {
        var headers = _ref7.headers,
            json = _ref7.json;
        return {
          data: json,
          total: parseInt(headers.get('content-range').split('/').pop(), 10)
        };
      });
    },

    /**
     * update 
     */
    update: function update(resource, params) {
      console.log('dataProvider.update', resource, params);
      return fetchJson("".concat(baseUrl, "/").concat(resource, "/").concat(params.id), {
        method: 'PUT',
        body: JSON.stringify(params.data)
      }).then(function (res) {
        return {
          data: res.json
        };
      })["catch"](function (err) {
        // Ugly hack for import overwrite
        if (err.status === 404) return create(resource, params);
        throw err;
      });
    },

    /**
     * updateMany 
     */
    updateMany: function updateMany(resource, params) {
      var query = {
        filter: JSON.stringify({
          id: params.ids
        })
      };
      return fetchJson("".concat(baseUrl, "/").concat(resource, "?").concat(queryString.stringify(query)), {
        method: 'PUT',
        body: JSON.stringify(params.data)
      }).then(function (_ref8) {
        var json = _ref8.json;
        return {
          data: json
        };
      });
    },

    /**
     * create 
     */
    create: create,

    /**
     * delete 
     */
    "delete": function _delete(resource, params) {
      return fetchJson("".concat(baseUrl, "/").concat(resource, "/").concat(params.id), {
        method: 'DELETE'
      }).then(function () {
        return {
          data: resource
        };
      });
    },

    /**
     * deleteMany 
     */
    deleteMany: function () {
      var _deleteMany = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(resource, params) {
        var deletedIds, _iterator, _step, id, url;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                deletedIds = [];
                _iterator = _createForOfIteratorHelper(params.ids);
                _context4.prev = 2;

                _iterator.s();

              case 4:
                if ((_step = _iterator.n()).done) {
                  _context4.next = 18;
                  break;
                }

                id = _step.value;
                url = "".concat(baseUrl, "/").concat(resource, "/").concat(id);
                _context4.prev = 7;
                _context4.next = 10;
                return fetchJson(url, {
                  method: 'DELETE'
                });

              case 10:
                deletedIds.push(id);
                _context4.next = 16;
                break;

              case 13:
                _context4.prev = 13;
                _context4.t0 = _context4["catch"](7);
                console.log('delete error', _context4.t0);

              case 16:
                _context4.next = 4;
                break;

              case 18:
                _context4.next = 23;
                break;

              case 20:
                _context4.prev = 20;
                _context4.t1 = _context4["catch"](2);

                _iterator.e(_context4.t1);

              case 23:
                _context4.prev = 23;

                _iterator.f();

                return _context4.finish(23);

              case 26:
                return _context4.abrupt("return", {
                  data: deletedIds
                });

              case 27:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[2, 20, 23, 26], [7, 13]]);
      }));

      function deleteMany(_x6, _x7) {
        return _deleteMany.apply(this, arguments);
      }

      return deleteMany;
    }()
  };
});

function kebabToCamel(s) {
  return s.replace(/(-\w)/g, function (m) {
    return m[1].toUpperCase();
  });
}

awsAmplify.Auth.configure({
  Auth: {
    region: 'eu-west-1',
    userPoolId: 'eu-west-1_QHFROumrL',
    userPoolWebClientId: '2fdpo91r8b6ing6f3558kia6rb'
  }
});
var authProvider = {
  login: function login(params) {
    return Promise.resolve();
  },
  logout: function logout(params) {
    return awsAmplify.Auth.signOut();
  },
  checkAuth: function checkAuth(params) {
    return Promise.resolve();
  },
  checkError: function checkError(error) {
    return Promise.resolve();
  },
  getPermissions: function getPermissions(params) {
    return Promise.resolve();
  }
};

var AdminContext = /*#__PURE__*/React__default['default'].createContext({});

var Admin = function Admin(_ref) {
  var appId = _ref.appId,
      _ref$env = _ref.env,
      env = _ref$env === void 0 ? 'dev' : _ref$env,
      props = _objectWithoutProperties(_ref, ["appId", "env"]);

  var baseUrl = "https://".concat(env, ".lolo.company/").concat(appId);

  var dataProvider = _dataProvider(baseUrl);

  var RAdmin = uiReact.withAuthenticator(function () {
    return /*#__PURE__*/React__default['default'].createElement(ra.Admin, _extends({
      dataProvider: dataProvider,
      authProvider: authProvider,
      title: "Lolo Admin"
    }, props), props.children);
  });
  return /*#__PURE__*/React__default['default'].createElement(AdminContext.Provider, {
    value: {
      baseUrl: baseUrl,
      dataProvider: dataProvider
    }
  }, /*#__PURE__*/React__default['default'].createElement(RAdmin, null));
};

var CreateActions = function CreateActions(_ref) {
  var basePath = _ref.basePath,
      resource = _ref.resource;
  return /*#__PURE__*/React__default['default'].createElement(ra.TopToolbar, null, /*#__PURE__*/React__default['default'].createElement(ra.ListButton, {
    basePath: basePath,
    resource: resource
  }));
};

var Form = core.withTheme(materialUi.Theme);

var Create = function Create(props) {
  var _useState = React.useState({}),
      _useState2 = _slicedToArray(_useState, 2),
      formData = _useState2[0],
      setFormData = _useState2[1];

  var _useState3 = React.useState(true),
      _useState4 = _slicedToArray(_useState3, 2),
      hasErrors = _useState4[0],
      setHasErrors = _useState4[1];

  var _useState5 = React.useState(false),
      _useState6 = _slicedToArray(_useState5, 2),
      liveValidate = _useState6[0],
      setLiveValidate = _useState6[1];

  var _useContext = React.useContext(ResourceContext),
      schema = _useContext.schema,
      uiSchema = _useContext.uiSchema;

  var form;

  var _ra$useCreateControll = ra.useCreateController(_objectSpread2({}, props)),
      defaultTitle = _ra$useCreateControll.defaultTitle,
      record = _ra$useCreateControll.record,
      save = _ra$useCreateControll.save,
      saving = _ra$useCreateControll.saving;

  if (!schema) return null;
  return /*#__PURE__*/React__default['default'].createElement("div", null, /*#__PURE__*/React__default['default'].createElement(CreateActions, props), /*#__PURE__*/React__default['default'].createElement(ra.TitleForRecord, {
    title: props.title,
    record: record,
    defaultTitle: defaultTitle
  }), /*#__PURE__*/React__default['default'].createElement(core$1.Card, null, /*#__PURE__*/React__default['default'].createElement(core$1.Box, {
    px: 2,
    pb: 1
  }, /*#__PURE__*/React__default['default'].createElement(Form, {
    ref: function ref(f) {
      form = f;
    },
    schema: schema,
    uiSchema: uiSchema,
    formData: formData,
    showErrorList: false,
    liveValidate: liveValidate,
    onChange: function onChange(_ref) {
      var formData = _ref.formData,
          errors = _ref.errors;
      console.log('onChange', form && form.state);
      if (!liveValidate) setLiveValidate(true);
      setFormData(formData);
      setHasErrors(!!errors.length);
    },
    onSubmit: function onSubmit(_ref2) {
      var formData = _ref2.formData;
      return save(formData);
    }
  }, ' '))), /*#__PURE__*/React__default['default'].createElement(ra.Toolbar, null, /*#__PURE__*/React__default['default'].createElement(core$1.Box, {
    display: "flex",
    justifyContent: "space-between",
    width: "100%"
  }, /*#__PURE__*/React__default['default'].createElement(ra.SaveButton, {
    saving: saving,
    disabled: hasErrors,
    handleSubmitWithRedirect: function handleSubmitWithRedirect() {
      return form.submit();
    }
  }))));
};

var EditActions = function EditActions(_ref) {
  var basePath = _ref.basePath,
      resource = _ref.resource;
  return /*#__PURE__*/React__default['default'].createElement(ra.TopToolbar, null, /*#__PURE__*/React__default['default'].createElement(ra.ListButton, {
    basePath: basePath,
    resource: resource
  }));
};

var Form$1 = core.withTheme(materialUi.Theme);

var Edit = function Edit(props) {
  var _useState = React.useState({}),
      _useState2 = _slicedToArray(_useState, 2),
      formData = _useState2[0],
      setFormData = _useState2[1];

  var _useState3 = React.useState(true),
      _useState4 = _slicedToArray(_useState3, 2),
      hasErrors = _useState4[0],
      setHasErrors = _useState4[1];

  var _useContext = React.useContext(ResourceContext),
      schema = _useContext.schema,
      uiSchema = _useContext.uiSchema;

  var form;

  var _ra$useEditController = ra.useEditController(_objectSpread2(_objectSpread2({}, props), {}, {
    undoable: false
  })),
      basePath = _ra$useEditController.basePath,
      record = _ra$useEditController.record,
      resource = _ra$useEditController.resource,
      save = _ra$useEditController.save,
      saving = _ra$useEditController.saving;

  React.useEffect(function () {
    return setFormData(record);
  }, [record]);
  if (!schema) return null;
  return /*#__PURE__*/React__default['default'].createElement("div", null, /*#__PURE__*/React__default['default'].createElement(EditActions, props), /*#__PURE__*/React__default['default'].createElement(ra.TitleForRecord, {
    title: props.title,
    record: record,
    defaultTitle: getTitle(resource)
  }), /*#__PURE__*/React__default['default'].createElement(core$1.Card, null, /*#__PURE__*/React__default['default'].createElement(core$1.Box, {
    px: 2,
    pb: 1
  }, /*#__PURE__*/React__default['default'].createElement(Form$1, {
    ref: function ref(f) {
      form = f;
    },
    schema: schema,
    uiSchema: uiSchema,
    formData: formData,
    showErrorList: false,
    liveValidate: true,
    onChange: function onChange(_ref) {
      var formData = _ref.formData,
          errors = _ref.errors;
      setFormData(formData);
      setHasErrors(!!errors.length);
    },
    onSubmit: function onSubmit(_ref2) {
      var formData = _ref2.formData;
      return save(formData);
    }
  }, ' '))), /*#__PURE__*/React__default['default'].createElement(ra.Toolbar, null, /*#__PURE__*/React__default['default'].createElement(core$1.Box, {
    display: "flex",
    justifyContent: "space-between",
    width: "100%"
  }, /*#__PURE__*/React__default['default'].createElement(ra.SaveButton, {
    saving: saving,
    disabled: hasErrors,
    handleSubmitWithRedirect: function handleSubmitWithRedirect() {
      return form.submit();
    }
  }), /*#__PURE__*/React__default['default'].createElement(ra.DeleteButton, {
    record: record,
    basePath: basePath,
    resource: resource,
    undoable: false
  }))));
};

var getTitle = function getTitle(resource, record) {
  return 'Edit ' + inflection.titleize(inflection.singularize(resource));
};

var ImportButton = (function (props) {
  var _useContext = React.useContext(ResourceContext),
      schema = _useContext.schema;

  if (!schema) return;
  return /*#__PURE__*/React__default['default'].createElement(reactAdminImportCsv.ImportButton, _extends({
    preCommitCallback: function preCommitCallback(action, data) {
      /* Typecast properties based on schema */
      var _iterator = _createForOfIteratorHelper(data),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var record = _step.value;

          for (var _i = 0, _Object$entries = Object.entries(record); _i < _Object$entries.length; _i++) {
            var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
                key = _Object$entries$_i[0],
                val = _Object$entries$_i[1];

            var fieldSchema = schema.properties[key] || {};

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

              default:
            }
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return data;
    },
    postCommitCallback: function postCommitCallback(report) {
      /* disable concurrency */
    }
  }, props));
});

var ListActions = function ListActions(props) {
  var className = props.className,
      exporter = props.exporter,
      filters = props.filters,
      maxResults = props.maxResults,
      rest = _objectWithoutProperties(props, ["className", "exporter", "filters", "maxResults"]);

  var _ra$useListContext = ra.useListContext(),
      currentSort = _ra$useListContext.currentSort,
      resource = _ra$useListContext.resource,
      displayedFilters = _ra$useListContext.displayedFilters,
      filterValues = _ra$useListContext.filterValues,
      basePath = _ra$useListContext.basePath,
      showFilter = _ra$useListContext.showFilter,
      total = _ra$useListContext.total;

  return /*#__PURE__*/React__default['default'].createElement(ra.TopToolbar, _extends({
    className: className
  }, ra.sanitizeListRestProps(rest)), filters && /*#__PURE__*/React.cloneElement(filters, {
    resource: resource,
    showFilter: showFilter,
    displayedFilters: displayedFilters,
    filterValues: filterValues,
    context: 'button'
  }), /*#__PURE__*/React__default['default'].createElement(ra.CreateButton, {
    basePath: basePath
  }), /*#__PURE__*/React__default['default'].createElement(ra.ExportButton, {
    disabled: total === 0,
    resource: resource,
    sort: currentSort,
    filterValues: filterValues,
    maxResults: maxResults
  }), /*#__PURE__*/React__default['default'].createElement(ImportButton, props));
};

var useStyles = styles.makeStyles(function (theme) {
  return {
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
  };
}, {
  name: 'RaEmpty'
});

var Empty = function Empty(props) {
  var _useListContext = raCore.useListContext(props),
      resource = _useListContext.resource,
      basePath = _useListContext.basePath;

  var classes = useStyles(props);
  var translate = raCore.useTranslate();
  var resourceName = translate("resources.".concat(resource, ".forcedCaseName"), {
    smart_count: 0,
    _: inflection__default['default'].humanize(translate("resources.".concat(resource, ".name"), {
      smart_count: 0,
      _: inflection__default['default'].pluralize(resource)
    }), true)
  });
  var emptyMessage = translate('ra.page.empty', {
    name: resourceName
  });
  var inviteMessage = translate('ra.page.invite');
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: classes.message
  }, /*#__PURE__*/React.createElement(Inbox__default['default'], {
    className: classes.icon
  }), /*#__PURE__*/React.createElement(core$1.Typography, {
    variant: "h4",
    paragraph: true
  }, translate("resources.".concat(resource, ".empty"), {
    _: emptyMessage
  })), /*#__PURE__*/React.createElement(core$1.Typography, {
    variant: "body1"
  }, translate("resources.".concat(resource, ".invite"), {
    _: inviteMessage
  }))), /*#__PURE__*/React.createElement("div", {
    className: classes.toolbar
  }, /*#__PURE__*/React.createElement(ra.CreateButton, {
    variant: "contained",
    basePath: basePath
  }), /*#__PURE__*/React.createElement(ImportButton, props)));
};

var Filter = function Filter(props) {
  return /*#__PURE__*/React__default['default'].createElement(ra.Filter, props, Object.entries(props.schema.properties).map(toInput));
};

var toInput = function toInput(_ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      key = _ref2[0],
      fieldSchema = _ref2[1];

  var _enum = fieldSchema["enum"],
      _fieldSchema$enumName = fieldSchema.enumNames,
      enumNames = _fieldSchema$enumName === void 0 ? [] : _fieldSchema$enumName;
  var fieldProps = {
    label: fieldSchema.title,
    source: key,
    key: key
  };

  if (key.endsWith('Id')) {
    var resource = key.replace(/Id$/, '');
    return /*#__PURE__*/React__default['default'].createElement(ra.ReferenceInput, _extends({}, fieldProps, {
      reference: resource + 's'
    }), /*#__PURE__*/React__default['default'].createElement(ra.SelectInput, {
      optionText: "name"
    }));
  }

  if (_enum) {
    var choices = _enum.map(function (id, i) {
      return {
        id: id,
        name: enumNames[i] || id
      };
    });

    return /*#__PURE__*/React__default['default'].createElement(ra.SelectInput, _extends({}, fieldProps, {
      choices: choices
    }));
  }

  if (fieldSchema.type === 'boolean') {
    return /*#__PURE__*/React__default['default'].createElement(ra.BooleanInput, fieldProps);
  }

  return /*#__PURE__*/React__default['default'].createElement(ra.TextInput, fieldProps);
};

var List = function List(props) {
  var _useContext = React.useContext(ResourceContext),
      schema = _useContext.schema,
      timestamps = _useContext.timestamps;

  if (!schema) return null;
  var name = schema.properties.name ? 'name' : 'id';
  return /*#__PURE__*/React__default['default'].createElement(ra.List, _extends({}, props, {
    filters: /*#__PURE__*/React__default['default'].createElement(Filter, {
      schema: schema
    }),
    actions: /*#__PURE__*/React__default['default'].createElement(ListActions, null),
    empty: /*#__PURE__*/React__default['default'].createElement(Empty, null)
  }), /*#__PURE__*/React__default['default'].createElement(ra.Datagrid, {
    rowClick: "edit"
  }, /*#__PURE__*/React__default['default'].createElement(ra.TextField, {
    source: name,
    key: name
  }), Object.entries(schema.properties).map(toField), timestamps.map(function (key) {
    return /*#__PURE__*/React__default['default'].createElement(ra.DateField, {
      source: key,
      key: key
    });
  })));
};

var toField = function toField(_ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      key = _ref2[0],
      fieldSchema = _ref2[1];

  if (key === 'name') return null;
  var fieldProps = {
    source: key,
    label: fieldSchema.title,
    key: key
  };

  switch (fieldSchema.type) {
    case 'string':
      if (key.endsWith('Id')) return refField(fieldProps);
      if (fieldSchema["enum"]) return enumField(fieldProps, fieldSchema);
      return /*#__PURE__*/React__default['default'].createElement(ra.TextField, fieldProps);

    case 'boolean':
      return /*#__PURE__*/React__default['default'].createElement(ra.BooleanField, fieldProps);

    case 'integer':
    case 'number':
      return /*#__PURE__*/React__default['default'].createElement(ra.NumberField, fieldProps);

    default:
      return null;
  }
};

var refField = function refField(_ref3) {
  var key = _ref3.key,
      props = _objectWithoutProperties(_ref3, ["key"]);

  return /*#__PURE__*/React__default['default'].createElement(ra.ReferenceField, _extends({
    reference: key.replace(/Id$/, '') + 's',
    key: key
  }, props), /*#__PURE__*/React__default['default'].createElement(ra.TextField, {
    source: "name"
  }));
};

var enumField = function enumField(fieldProps, fieldSchema) {
  var _enum = fieldSchema["enum"],
      _fieldSchema$enumName = fieldSchema.enumNames,
      enumNames = _fieldSchema$enumName === void 0 ? [] : _fieldSchema$enumName;
  return /*#__PURE__*/React__default['default'].createElement(ra.SelectField, _extends({}, fieldProps, {
    choices: _enum.map(function (id, i) {
      return {
        id: id,
        name: enumNames[i] || id
      };
    }),
    translateChoice: false
  }));
};

var ReferenceInputWidget = function ReferenceInputWidget(props) {
  var _useContext = React.useContext(AdminContext),
      dataProvider = _useContext.dataProvider;

  var id = props.id,
      value = props.value,
      _onChange = props.onChange;

  var _useState = React.useState(),
      _useState2 = _slicedToArray(_useState, 2),
      data = _useState2[0],
      setData = _useState2[1];

  React.useEffect(function () {
    dataProvider.getList(toResource(id), {}).then(function (res) {
      return setData(res.data);
    });
  }, [dataProvider, id]);
  return data ? /*#__PURE__*/React__default['default'].createElement(core$1.FormControl, null, /*#__PURE__*/React__default['default'].createElement(core$1.InputLabel, null, toLabel(id)), /*#__PURE__*/React__default['default'].createElement(core$1.Select, {
    labelId: id,
    id: id,
    value: value,
    onChange: function onChange(ev) {
      return _onChange(ev.target.value);
    }
  }, data.map(function (item) {
    return /*#__PURE__*/React__default['default'].createElement(core$1.MenuItem, {
      value: item.id,
      key: item.id
    }, item.name);
  }))) : null;
};

var toResource = function toResource(id) {
  return id.split('_').pop().replace(/Id$/, '') + 's';
};

var toLabel = function toLabel(id) {
  return inflection.humanize(inflection.singularize(toResource(id)));
};

var ResourceContext = /*#__PURE__*/React__default['default'].createContext();

var Resource = function Resource(props) {
  var name = props.name,
      _props$timestamps = props.timestamps,
      timestamps = _props$timestamps === void 0 ? ['createdAt'] : _props$timestamps;

  var _useState = React.useState(),
      _useState2 = _slicedToArray(_useState, 2),
      schema = _useState2[0],
      setSchema = _useState2[1];

  var _useState3 = React.useState(),
      _useState4 = _slicedToArray(_useState3, 2),
      uiSchema = _useState4[0],
      setUiSchema = _useState4[1];

  var _useContext = React.useContext(AdminContext),
      baseUrl = _useContext.baseUrl;

  React.useEffect(function () {
    var schemaUrl = baseUrl + '/schemas/' + name.replace(/s$/, '');
    ra.fetchUtils.fetchJson(schemaUrl).then(function (_ref) {
      var json = _ref.json;

      var _json$uiSchema = json.uiSchema,
          uiSchema = _json$uiSchema === void 0 ? {} : _json$uiSchema,
          schema = _objectWithoutProperties(json, ["uiSchema"]);

      enableWidgets(uiSchema, schema);
      setSchema(schema);
      setUiSchema(uiSchema);
    });
  }, [baseUrl, name]);
  return /*#__PURE__*/React__default['default'].createElement(ResourceContext.Provider, {
    value: {
      schema: schema,
      uiSchema: uiSchema,
      timestamps: timestamps
    }
  }, /*#__PURE__*/React__default['default'].createElement(ra.Resource, _extends({
    list: List,
    create: Create,
    edit: Edit
  }, props)));
};

var enableWidgets = function enableWidgets(uiSchema, schema) {
  Object.keys(schema.properties).filter(function (k) {
    return k.endsWith('Id');
  }).forEach(function (k) {
    uiSchema[k] = {
      'ui:widget': ReferenceInputWidget
    };
  });
};

exports.LoloAdmin = Admin;
exports.LoloResource = Resource;
