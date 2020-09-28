"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var ra = _interopRequireWildcard(require("react-admin"));

var _utils = require("./utils");

var _rjsf = require("./rjsf");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const Filter = props => {
  return /*#__PURE__*/_react.default.createElement(ra.Filter, props, Object.entries(props.schema.properties).map(toInput));
};

const toInput = ([key, fieldSchema]) => {
  const fieldProps = {
    label: fieldSchema.title,
    source: key,
    key
  };
  if (key.endsWith('Id')) return /*#__PURE__*/_react.default.createElement(RefInput, fieldProps);
  if (fieldSchema.enum) return enumInput(fieldProps, fieldSchema);

  switch (fieldSchema.type) {
    case 'string':
      return /*#__PURE__*/_react.default.createElement(ra.TextInput, fieldProps);

    case 'boolean':
      return /*#__PURE__*/_react.default.createElement(ra.BooleanInput, fieldProps);

    case 'integer':
    case 'number':
      return /*#__PURE__*/_react.default.createElement(ra.NumberInput, fieldProps);

    default:
      return null;
  }
};

const RefInput = ({
  source,
  label
}) => {
  const {
    setFilters
  } = ra.useListContext();
  return /*#__PURE__*/_react.default.createElement(_rjsf.ReferenceInputWidget, {
    id: source,
    schema: {
      title: label
    },
    onChange: value => {
      setFilters({
        [source]: value
      });
    },
    variant: "filled"
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

  return /*#__PURE__*/_react.default.createElement(ra.SelectInput, _extends({}, fieldProps, {
    choices: choices
  }));
};

var _default = Filter;
exports.default = _default;