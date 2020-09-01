"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var ra = _interopRequireWildcard(require("react-admin"));

var _ImportButton = _interopRequireDefault(require("./ImportButton"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const ListActions = props => {
  const {
    className,
    exporter,
    filters,
    maxResults,
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
  return /*#__PURE__*/_react.default.createElement(ra.TopToolbar, _extends({
    className: className
  }, ra.sanitizeListRestProps(rest)), filters && /*#__PURE__*/(0, _react.cloneElement)(filters, {
    resource,
    showFilter,
    displayedFilters,
    filterValues,
    context: 'button'
  }), /*#__PURE__*/_react.default.createElement(ra.CreateButton, {
    basePath: basePath
  }), /*#__PURE__*/_react.default.createElement(ra.ExportButton, {
    disabled: total === 0,
    resource: resource,
    sort: currentSort,
    filterValues: filterValues,
    maxResults: maxResults
  }), /*#__PURE__*/_react.default.createElement(_ImportButton.default, props));
};

var _default = ListActions;
exports.default = _default;