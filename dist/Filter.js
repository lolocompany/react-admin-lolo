"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var ra = _interopRequireWildcard(require("react-admin"));

var _utils = require("./utils");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const Filter = props => {
  return /*#__PURE__*/_react.default.createElement(ra.Filter, props, Object.entries(props.schema.properties).map(toInput));
};

const toInput = ([key, fieldSchema]) => {
  const {
    enum: _enum,
    enumNames = []
  } = fieldSchema;
  const fieldProps = {
    label: fieldSchema.title,
    source: key,
    key
  };

  if (key.endsWith('Id')) {
    return /*#__PURE__*/_react.default.createElement(ra.ReferenceInput, _extends({}, fieldProps, {
      reference: (0, _utils.keyToRef)(key)
    }), /*#__PURE__*/_react.default.createElement(ra.SelectInput, {
      optionText: "name"
    }));
  }

  if (_enum) {
    const choices = _enum.map((id, i) => ({
      id,
      name: enumNames[i] || id
    }));

    return /*#__PURE__*/_react.default.createElement(ra.SelectInput, _extends({}, fieldProps, {
      choices: choices
    }));
  }

  if (fieldSchema.type === 'boolean') {
    return /*#__PURE__*/_react.default.createElement(ra.BooleanInput, fieldProps);
  }

  return /*#__PURE__*/_react.default.createElement(ra.TextInput, fieldProps);
};

var _default = Filter;
exports.default = _default;