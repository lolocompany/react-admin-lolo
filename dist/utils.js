"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeReadonly = exports.deepClone = exports.isEqual = exports.SelectInput = exports.TextField = exports.keyToRef = void 0;

var _react = _interopRequireDefault(require("react"));

var ra = _interopRequireWildcard(require("react-admin"));

var _traverse = _interopRequireDefault(require("traverse"));

var _inflection = require("inflection");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const keyToRef = key => (0, _inflection.transform)(key.replace(/Id$/, ''), ['underscore', 'dasherize', 'pluralize']);
/* HOCs for using either name or id as label */


exports.keyToRef = keyToRef;

const TextField = props => {
  const source = props.record.name ? 'name' : 'id';
  return /*#__PURE__*/_react.default.createElement(ra.TextField, _extends({}, props, {
    source: source
  }));
};

exports.TextField = TextField;

const SelectInput = props => {
  const optionText = props.choices[0].name ? 'name' : 'id';
  return /*#__PURE__*/_react.default.createElement(ra.SelectInput, _extends({}, props, {
    optionText: optionText
  }));
};

exports.SelectInput = SelectInput;

const isEqual = (a, b) => {
  return JSON.stringify(a) === JSON.stringify(b);
};

exports.isEqual = isEqual;

const deepClone = value => {
  return JSON.parse(JSON.stringify(value));
};

exports.deepClone = deepClone;

const removeReadonly = json => {
  const {
    uiSchema = {},
    ...schema
  } = deepClone(json);
  (0, _traverse.default)(schema).forEach(function () {
    if (this.key === 'readOnly' && this.node === true) {
      this.parent.remove();
    }
  });
  return {
    uiSchema,
    ...schema
  };
};

exports.removeReadonly = removeReadonly;