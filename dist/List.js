"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var ra = _interopRequireWildcard(require("react-admin"));

var _Resource = require("./Resource");

var _utils = require("./utils");

var _ListActions = _interopRequireDefault(require("./ListActions"));

var _ListEmpty = _interopRequireDefault(require("./ListEmpty"));

var _Filter = _interopRequireDefault(require("./Filter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const List = props => {
  const {
    schema,
    timestamps
  } = (0, _react.useContext)(_Resource.ResourceContext);
  if (!schema) return null;
  return /*#__PURE__*/_react.default.createElement(ra.List, _extends({}, props, {
    filters: /*#__PURE__*/_react.default.createElement(_Filter.default, {
      schema: schema
    }),
    actions: /*#__PURE__*/_react.default.createElement(_ListActions.default, null),
    empty: /*#__PURE__*/_react.default.createElement(_ListEmpty.default, null)
  }), /*#__PURE__*/_react.default.createElement(ra.Datagrid, {
    rowClick: props.hasShow ? 'show' : 'edit'
  }, Object.entries(schema.properties).map(toField), timestamps.map(key => /*#__PURE__*/_react.default.createElement(ra.DateField, {
    source: key,
    key: key
  }))));
};

const toField = ([key, fieldSchema]) => {
  const fieldProps = {
    source: key,
    label: fieldSchema.title,
    key
  };

  switch (fieldSchema.type) {
    case 'string':
      if (key.endsWith('Id')) return refField(fieldProps);
      if (fieldSchema.enum) return enumField(fieldProps, fieldSchema);
      return /*#__PURE__*/_react.default.createElement(ra.TextField, fieldProps);

    case 'boolean':
      return /*#__PURE__*/_react.default.createElement(ra.BooleanField, fieldProps);

    case 'integer':
    case 'number':
      return /*#__PURE__*/_react.default.createElement(ra.NumberField, fieldProps);

    default:
      return null;
  }
};

const refField = ({
  key,
  ...props
}) => {
  return /*#__PURE__*/_react.default.createElement(ra.ReferenceField, _extends({
    reference: (0, _utils.keyToRef)(key),
    key: key
  }, props), /*#__PURE__*/_react.default.createElement(ra.TextField, {
    source: "name"
  }));
};

const enumField = (fieldProps, fieldSchema) => {
  const {
    enum: _enum,
    enumNames = []
  } = fieldSchema;
  return /*#__PURE__*/_react.default.createElement(ra.SelectField, _extends({}, fieldProps, {
    choices: _enum.map((id, i) => ({
      id,
      name: enumNames[i] || id
    })),
    translateChoice: false
  }));
};

var _default = List;
exports.default = _default;