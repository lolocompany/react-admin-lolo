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
var Button = require('@material-ui/core/Button');
var reactRouter = require('react-router');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var Auth__default = /*#__PURE__*/_interopDefaultLegacy(Auth);
var Button__default = /*#__PURE__*/_interopDefaultLegacy(Button);

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

var dataProvider = (function (baseUrl) {
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

  var buildQs = function buildQs(filter) {
    return Object.entries(filter).reduce(function (memo, _ref2) {
      var _ref3 = _slicedToArray(_ref2, 2),
          k = _ref3[0],
          v = _ref3[1];

      memo["q[".concat(k, "]")] = v;
      return memo;
    }, {});
  };

  return {
    getList: function getList(resource, params) {
      var _params$pagination = params.pagination,
          _params$pagination$pa = _params$pagination.page,
          page = _params$pagination$pa === void 0 ? 0 : _params$pagination$pa,
          _params$pagination$pe = _params$pagination.perPage,
          perPage = _params$pagination$pe === void 0 ? 10 : _params$pagination$pe;
      var _params$sort = params.sort,
          _params$sort$field = _params$sort.field,
          field = _params$sort$field === void 0 ? 'id' : _params$sort$field,
          _params$sort$order = _params$sort.order,
          order = _params$sort$order === void 0 ? 'ASC' : _params$sort$order;

      var query = _objectSpread2({
        limit: perPage,
        sort: "".concat(field, " ").concat(order.toLowerCase()),
        offset: (page - 1) * perPage
      }, buildQs(params.filter));

      var url = "".concat(baseUrl, "/").concat(resource, "?").concat(queryString.stringify(query));
      return fetchJson(url).then(function (_ref4) {
        var headers = _ref4.headers,
            json = _ref4.json;
        return {
          data: json[kebabToCamel(resource)],
          total: json.total
        };
      });
    },
    getOne: function getOne(resource, params) {
      return fetchJson("".concat(baseUrl, "/").concat(resource, "/").concat(params.id)).then(function (_ref5) {
        var json = _ref5.json;
        return {
          data: json
        };
      });
    },
    getMany: function getMany(resource, params) {
      var query = {
        filter: JSON.stringify({
          id: params.ids
        })
      };
      var url = "".concat(baseUrl, "/").concat(resource, "?").concat(queryString.stringify(query));
      return fetchJson(url).then(function (_ref6) {
        var json = _ref6.json;
        return {
          data: json
        };
      });
    },
    getManyReference: function getManyReference(resource, params) {
      var _params$pagination2 = params.pagination,
          page = _params$pagination2.page,
          perPage = _params$pagination2.perPage;
      var _params$sort2 = params.sort,
          field = _params$sort2.field,
          order = _params$sort2.order;
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
    update: function update(resource, params) {
      return fetchJson("".concat(baseUrl, "/").concat(resource, "/").concat(params.id), {
        method: 'PUT',
        body: JSON.stringify(params.data)
      }).then(function (_ref8) {
        var json = _ref8.json;
        return {
          data: json
        };
      });
    },
    updateMany: function updateMany(resource, params) {
      var query = {
        filter: JSON.stringify({
          id: params.ids
        })
      };
      return fetchJson("".concat(baseUrl, "/").concat(resource, "?").concat(queryString.stringify(query)), {
        method: 'PUT',
        body: JSON.stringify(params.data)
      }).then(function (_ref9) {
        var json = _ref9.json;
        return {
          data: json
        };
      });
    },
    create: function create(resource, params) {
      return fetchJson("".concat(baseUrl, "/").concat(resource), {
        method: 'POST',
        body: JSON.stringify(params.data)
      }).then(function (_ref10) {
        var json = _ref10.json;
        return {
          data: _objectSpread2(_objectSpread2({}, params.data), {}, {
            id: json.id
          })
        };
      });
    },
    "delete": function _delete(resource, params) {
      return fetchJson("".concat(baseUrl, "/").concat(resource, "/").concat(params.id), {
        method: 'DELETE'
      }).then(function () {
        return {
          data: resource
        };
      });
    },
    deleteMany: function deleteMany(resource, params) {
      return fetchJson("".concat(baseUrl, "/").concat(resource, "/").concat(params.ids[0]), {
        method: 'DELETE'
      }).then(function (_ref11) {
        var json = _ref11.json;
        return {
          data: json
        };
      });
    }
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
  var RAdmin = uiReact.withAuthenticator(function () {
    return /*#__PURE__*/React__default['default'].createElement(ra.Admin, _extends({
      dataProvider: dataProvider(baseUrl),
      authProvider: authProvider,
      title: "Lolo Admin"
    }, props), props.children);
  });
  return /*#__PURE__*/React__default['default'].createElement(AdminContext.Provider, {
    value: {
      baseUrl: baseUrl
    }
  }, /*#__PURE__*/React__default['default'].createElement(RAdmin, null));
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

  var _useCreateController = ra.useCreateController(_objectSpread2({}, props)),
      defaultTitle = _useCreateController.defaultTitle,
      record = _useCreateController.record,
      save = _useCreateController.save,
      saving = _useCreateController.saving; //useEffect(() => setFormData(record), [ record ]);


  if (!schema) return null;
  return /*#__PURE__*/React__default['default'].createElement(core$1.Box, {
    p: "1em"
  }, /*#__PURE__*/React__default['default'].createElement(core$1.Box, {
    display: "flex"
  }, /*#__PURE__*/React__default['default'].createElement(core$1.Box, {
    flex: 2,
    mr: "1em"
  }, /*#__PURE__*/React__default['default'].createElement(ra.TitleForRecord, {
    title: props.title,
    record: record,
    defaultTitle: defaultTitle
  }), /*#__PURE__*/React__default['default'].createElement(Form, {
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
      setLiveValidate(true);
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

var BackButton = function BackButton(_ref) {
  var goBack = _ref.history.goBack,
      children = _ref.children,
      props = _objectWithoutProperties(_ref, ["history", "children"]);

  return /*#__PURE__*/React__default['default'].createElement(Button__default['default'], _extends({}, props, {
    onClick: goBack
  }), children);
};

reactRouter.withRouter(BackButton);

var Form$1 = core.withTheme(materialUi.Theme);

var LoloEdit = function LoloEdit(props) {
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

  var _useEditController = ra.useEditController(_objectSpread2(_objectSpread2({}, props), {}, {
    undoable: false
  })),
      basePath = _useEditController.basePath,
      defaultTitle = _useEditController.defaultTitle,
      record = _useEditController.record,
      resource = _useEditController.resource,
      save = _useEditController.save,
      saving = _useEditController.saving;

  React.useEffect(function () {
    return setFormData(record);
  }, [record]);
  if (!schema) return null;
  return /*#__PURE__*/React__default['default'].createElement(core$1.Box, {
    p: "1em"
  }, /*#__PURE__*/React__default['default'].createElement(core$1.Box, {
    display: "flex"
  }, /*#__PURE__*/React__default['default'].createElement(core$1.Box, {
    flex: 2,
    mr: "1em"
  }, /*#__PURE__*/React__default['default'].createElement(ra.TitleForRecord, {
    title: props.title,
    record: record,
    defaultTitle: defaultTitle
  }), /*#__PURE__*/React__default['default'].createElement(Form$1, {
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

  if (_enum) {
    var choices = _enum.map(function (id, i) {
      return {
        id: id,
        name: enumNames[i] || id
      };
    });

    return /*#__PURE__*/React__default['default'].createElement(ra.SelectInput, {
      source: key,
      choices: choices,
      key: key
    });
  } else {
    return /*#__PURE__*/React__default['default'].createElement(ra.TextInput, {
      label: key,
      source: key,
      key: key
    });
  }
};

var List = function List(props) {
  var _useContext = React.useContext(ResourceContext),
      schema = _useContext.schema;

  var _props$timestamps = props.timestamps,
      timestamps = _props$timestamps === void 0 ? ['createdAt', 'updatedAt'] : _props$timestamps;
  if (!schema) return null;
  var name = schema.properties.name ? 'name' : 'id';
  return /*#__PURE__*/React__default['default'].createElement(ra.List, _extends({}, props, {
    filters: /*#__PURE__*/React__default['default'].createElement(Filter, {
      schema: schema
    })
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

  switch (fieldSchema.type) {
    case 'string':
      if (key.endsWith('Id')) return refField(key);
      return /*#__PURE__*/React__default['default'].createElement(ra.TextField, {
        source: key,
        key: key
      });

    case 'boolean':
      return /*#__PURE__*/React__default['default'].createElement(ra.BooleanField, {
        source: key,
        key: key
      });

    case 'integer':
    case 'number':
      return /*#__PURE__*/React__default['default'].createElement(ra.NumberField, {
        source: key,
        key: key
      });

    default:
      return null;
  }
};

var refField = function refField(key) {
  var name = key.replace(/Id$/, '');
  return /*#__PURE__*/React__default['default'].createElement(ra.ReferenceField, {
    label: name,
    source: "id",
    reference: name + 's'
  }, /*#__PURE__*/React__default['default'].createElement(ra.TextField, {
    source: "name"
  }));
};

var ResourceContext = /*#__PURE__*/React__default['default'].createContext();

var Resource = function Resource(props) {
  var name = props.name;

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

      setSchema(schema);
      setUiSchema(uiSchema);
    });
  }, [baseUrl, name]);
  return /*#__PURE__*/React__default['default'].createElement(ResourceContext.Provider, {
    value: {
      schema: schema,
      uiSchema: uiSchema
    }
  }, /*#__PURE__*/React__default['default'].createElement(ra.Resource, _extends({
    list: List,
    create: Create,
    edit: LoloEdit
  }, props)));
};

exports.LoloAdmin = Admin;
exports.LoloResource = Resource;
