"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResourceContext = exports.Resource = void 0;

var _react = _interopRequireWildcard(require("react"));

var ra = _interopRequireWildcard(require("react-admin"));

var _traverse = _interopRequireDefault(require("traverse"));

var _Create = _interopRequireDefault(require("./Create"));

var _Edit = _interopRequireDefault(require("./Edit"));

var _List = _interopRequireDefault(require("./List"));

var rjsf = _interopRequireWildcard(require("./rjsf"));

var _Admin = require("./Admin");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const ResourceContext = /*#__PURE__*/_react.default.createContext();

exports.ResourceContext = ResourceContext;

const Resource = props => {
  const {
    name,
    timestamps = ['createdAt']
  } = props;
  const [schema, setSchema] = (0, _react.useState)();
  const [uiSchema, setUiSchema] = (0, _react.useState)();
  const {
    apiUrl
  } = (0, _react.useContext)(_Admin.AdminContext);
  (0, _react.useEffect)(() => {
    const schemaUrl = apiUrl + '/schemas/' + name.replace(/s$/, '');
    /*
    if (name === 'devices') {
    	const _schema = JSON.parse(JSON.stringify(cannedSchema));
    	const _uiSchema = {};
    	enableWidgets(_uiSchema, _schema);
    	setSchema(_schema);
    	setUiSchema(_uiSchema);
    	return;
    }
    */

    ra.fetchUtils.fetchJson(schemaUrl).then(({
      json
    }) => {
      const {
        uiSchema = {},
        ...schema
      } = json;
      enableWidgets(uiSchema, schema);
      setSchema(schema);
      setUiSchema(uiSchema);
    });
  }, [apiUrl, name]);
  return /*#__PURE__*/_react.default.createElement(ResourceContext.Provider, {
    value: {
      schema,
      uiSchema,
      timestamps
    }
  }, /*#__PURE__*/_react.default.createElement(ra.Resource, _extends({
    list: _List.default,
    create: _Create.default,
    edit: _Edit.default
  }, props)));
};

exports.Resource = Resource;

const enableWidgets = (uiSchema, schema) => {
  (0, _traverse.default)(schema).forEach(function () {
    if (/Id$/.test(this.key)) {
      const path = this.path.filter(item => item !== 'properties');
      (0, _traverse.default)(uiSchema).set(path, {
        'ui:widget': rjsf.ReferenceInputWidget
      });
    }
  });
};