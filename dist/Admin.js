"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Admin = void 0;

var _react = _interopRequireWildcard(require("react"));

var ra = _interopRequireWildcard(require("react-admin"));

var _data_provider = _interopRequireDefault(require("./data_provider"));

var _auth_provider = _interopRequireDefault(require("./auth_provider"));

var _i18n_provider = _interopRequireDefault(require("./i18n_provider"));

var _LoginPage = _interopRequireDefault(require("./LoginPage.js"));

require("./Admin.css");

var _useAdminContext = require("./hooks/useAdminContext");

var _AppBarDropdown = _interopRequireDefault(require("./components/AppBarDropdown"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const Admin = ({
  fields = {},
  widgets = {},
  apiUrl,
  accountsUrl,
  ...props
}) => {
  const dataProvider = props.dataProvider || (0, _data_provider.default)(apiUrl);
  const [isCustomConfigured, setIsCustomConfigured] = (0, _react.useState)(false);
  (0, _react.useEffect)(() => {
    if (props.dataProvider || props.authProvider) {
      setIsCustomConfigured(true);
    }
  }, [props.dataProvider, props.authProvider]);

  const RAdmin = () => /*#__PURE__*/_react.default.createElement(ra.Admin, _extends({
    dataProvider: dataProvider,
    authProvider: _auth_provider.default,
    i18nProvider: _i18n_provider.default,
    loginPage: _LoginPage.default,
    title: "Lolo Admin",
    logoutButton: _AppBarDropdown.default
  }, props), props.children);

  return /*#__PURE__*/_react.default.createElement(_useAdminContext.AdminContext, {
    data: {
      accountsUrl,
      authProvider: _auth_provider.default,
      dataProvider,
      isCustomConfigured,
      fields,
      widgets
    }
  }, /*#__PURE__*/_react.default.createElement(RAdmin, null));
};

exports.Admin = Admin;