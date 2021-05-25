"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactAdmin = require("react-admin");

var _PowerSettingsNew = _interopRequireDefault(require("@material-ui/icons/PowerSettingsNew"));

var _core = require("@material-ui/core");

var _useAdminContext = require("../hooks/useAdminContext");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const useStyles = (0, _core.makeStyles)(theme => ({
  dropdown: {
    width: 200,
    overflow: 'auto'
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}));

const AppBarDropdown = props => {
  const {
    accounts,
    selectedAccount,
    setSelectedAccount
  } = (0, _useAdminContext.useAdminContext)();
  const classes = useStyles();
  const refresh = (0, _reactAdmin.useRefresh)();

  const handleAccountSelect = account => {
    const selectedAcc = accounts.find(item => item.id === account.id);

    if (selectedAcc.isPrimary) {
      localStorage.removeItem('accountId');
    } else {
      localStorage.setItem('accountId', account.id);
    }

    refresh();
    setSelectedAccount(account);
  };

  const selectedAccountId = selectedAccount ? selectedAccount.id : '';
  return /*#__PURE__*/_react.default.createElement("div", {
    className: classes.dropdown
  }, /*#__PURE__*/_react.default.createElement(_core.List, null, /*#__PURE__*/_react.default.createElement(_core.ListSubheader, null, "Accounts"), accounts.map((account, i) => /*#__PURE__*/_react.default.createElement(_core.ListItem, {
    key: i,
    button: true,
    value: account.id,
    selected: account.id === selectedAccountId,
    disabled: account.id === selectedAccountId,
    onClick: () => handleAccountSelect(account)
  }, account.name)), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.divider
  }, /*#__PURE__*/_react.default.createElement(_core.Divider, {
    light: true
  })), /*#__PURE__*/_react.default.createElement(_reactAdmin.Logout, _extends({}, props, {
    icon: /*#__PURE__*/_react.default.createElement(_PowerSettingsNew.default, null)
  }))));
};

var _default = AppBarDropdown;
exports.default = _default;