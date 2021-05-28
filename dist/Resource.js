"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResourceContext = exports.Resource = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactRouter = require("react-router");

var ra = _interopRequireWildcard(require("react-admin"));

var _traverse = _interopRequireDefault(require("traverse"));

var _Create = _interopRequireDefault(require("./Create"));

var _Edit = _interopRequireDefault(require("./Edit"));

var _List = _interopRequireDefault(require("./List"));

var rjsf = _interopRequireWildcard(require("./rjsf"));

var _utils = require("./utils");

var _useAdminContext = require("./hooks/useAdminContext");

var _inflection = require("inflection");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const ResourceContext = /*#__PURE__*/_react.default.createContext();

exports.ResourceContext = ResourceContext;

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
  const [schema, setSchema] = (0, _react.useState)({});
  const [editSchema, setEditSchema] = (0, _react.useState)({});
  const [createSchema, setCreateSchema] = (0, _react.useState)({});
  const [listSchema, setListSchema] = (0, _react.useState)({});
  const {
    apiUrl,
    fields,
    widgets,
    selectedAccount
  } = (0, _useAdminContext.useAdminContext)();
  (0, _react.useEffect)(() => {
    if (intent === 'route' && selectedAccount) {
      const schemaUrl = apiUrl + '/schemas/' + (0, _inflection.singularize)(name);
      ra.fetchUtils.fetchJson(schemaUrl).then(({
        json: pristineSchema
      }) => {
        delete pristineSchema.additionalProperties;
        setSchema(pristineSchema);
        const writableSchema = enableWidgets((0, _utils.removeReadonly)(pristineSchema));
        setEditSchema(editSchemaTransform(writableSchema, pristineSchema, selectedAccount));
        setCreateSchema(createSchemaTransform(writableSchema, pristineSchema, selectedAccount));
        setListSchema(buildListSchema(listSchemaTransform, writableSchema, pristineSchema, selectedAccount));
      });
    }
  }, [apiUrl, name, selectedAccount]);
  return /*#__PURE__*/_react.default.createElement(ResourceContext.Provider, {
    value: {
      schema,
      editSchema,
      createSchema,
      listSchema,
      fields,
      widgets
    }
  }, /*#__PURE__*/_react.default.createElement(ra.Resource, _extends({
    list: _List.default,
    create: _Create.default,
    edit: _Edit.default
  }, props)));
};

exports.Resource = Resource;

const oneOf = part => part === 'oneOf';

const enableWidgets = json => {
  const {
    uiSchema = {},
    ...schema
  } = (0, _utils.deepClone)(json);
  (0, _traverse.default)(schema).forEach(function () {
    if (/Ids?$/.test(this.key)) {
      let path = this.path.filter(part => !['properties', 'dependencies'].includes(part));

      while (path.find(oneOf)) {
        path.splice(path.findIndex(oneOf) - 1, 3);
      }

      const schemaPatch = this.key.endsWith('s') ? {
        'ui:field': rjsf.ReferenceInputManyField
      } : {
        'ui:widget': (0, _reactRouter.withRouter)(rjsf.ReferenceInputWidget)
      }; // Don't overwrite any existing uiSchema

      (0, _traverse.default)(uiSchema).set(path, { ...schemaPatch,
        ...(0, _traverse.default)(uiSchema).get(path)
      });
    }
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