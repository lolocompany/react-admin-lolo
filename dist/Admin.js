"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AdminContext = exports.Admin = void 0;

var _react = _interopRequireDefault(require("react"));

var ra = _interopRequireWildcard(require("react-admin"));

var _PowerSettingsNew = _interopRequireDefault(require("@material-ui/icons/PowerSettingsNew"));

var _data_provider = _interopRequireDefault(require("./data_provider"));

var _auth_provider = _interopRequireDefault(require("./auth_provider"));

var _i18n_provider = _interopRequireDefault(require("./i18n_provider"));

var _LoginPage = _interopRequireDefault(require("./LoginPage.js"));

require("./Admin.css");

var _auth = _interopRequireDefault(require("@aws-amplify/auth"));

var _core = require("@material-ui/core");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const CustomAppbarDropdown = props => {
  console.log(props, 'props');

  const [accounts, setAccounts] = _react.default.useState([]);

  _react.default.useEffect(() => {
    const getAccounts = async () => {
      const session = await _auth.default.currentSession();
      let headers = new Headers({
        Accept: 'application/json'
      });
      headers.set('Authorization', session.idToken.jwtToken);
      ra.fetchUtils.fetchJson('https://dev.lolo.company/api/accounts/all', {
        headers
      }).then(({
        json
      }) => {
        setAccounts(json.accounts);
      }).catch(e => {
        console.log(e);
      });
    };

    if (!accounts.length) {
      getAccounts();
    }
  }, []);

  return /*#__PURE__*/_react.default.createElement("div", {
    style: {
      width: 200,
      overflow: 'auto'
    }
  }, /*#__PURE__*/_react.default.createElement(_core.List, null, /*#__PURE__*/_react.default.createElement(_core.ListSubheader, null, "Accounts"), accounts.map((v, i) => /*#__PURE__*/_react.default.createElement(_core.ListItem, {
    button: true,
    key: i
  }, v.name)), /*#__PURE__*/_react.default.createElement(_core.Divider, {
    light: true
  }), /*#__PURE__*/_react.default.createElement(ra.Logout, _extends({}, props, {
    icon: /*#__PURE__*/_react.default.createElement(_PowerSettingsNew.default, null)
  }))));
};

const AdminContext = /*#__PURE__*/_react.default.createContext({});

exports.AdminContext = AdminContext;

const Admin = ({
  apiUrl,
  fields = {},
  widgets = {},
  ...props
}) => {
  const dataProvider = (0, _data_provider.default)(apiUrl);

  const RAdmin = () => /*#__PURE__*/_react.default.createElement(ra.Admin, _extends({
    dataProvider: dataProvider,
    authProvider: _auth_provider.default,
    i18nProvider: _i18n_provider.default,
    loginPage: _LoginPage.default,
    title: "Lolo Admin",
    logoutButton: CustomAppbarDropdown
  }, props), props.children);

  return /*#__PURE__*/_react.default.createElement(AdminContext.Provider, {
    value: {
      apiUrl,
      dataProvider,
      fields,
      widgets
    }
  }, /*#__PURE__*/_react.default.createElement(RAdmin, null));
};

exports.Admin = Admin;