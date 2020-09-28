"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AdminContext = exports.Admin = void 0;

var _react = _interopRequireDefault(require("react"));

var ra = _interopRequireWildcard(require("react-admin"));

var _uiReact = require("@aws-amplify/ui-react");

var _data_provider = _interopRequireDefault(require("./data_provider"));

var _auth_provider = _interopRequireDefault(require("./auth_provider"));

require("./Admin.css");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const AdminContext = /*#__PURE__*/_react.default.createContext({});

exports.AdminContext = AdminContext;

const Admin = ({
  apiUrl,
  ...props
}) => {
  const dataProvider = (0, _data_provider.default)(apiUrl);
  const RAdmin = (0, _uiReact.withAuthenticator)(() => /*#__PURE__*/_react.default.createElement(ra.Admin, _extends({
    dataProvider: dataProvider,
    authProvider: _auth_provider.default,
    title: "Lolo Admin"
  }, props), props.children));
  return /*#__PURE__*/_react.default.createElement(AdminContext.Provider, {
    value: {
      apiUrl,
      dataProvider
    }
  }, /*#__PURE__*/_react.default.createElement(RAdmin, null));
};

exports.Admin = Admin;