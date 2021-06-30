"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAdminContext = useAdminContext;
exports.AdminContext = AdminContext;

var _react = _interopRequireWildcard(require("react"));

var ra = _interopRequireWildcard(require("react-admin"));

var _useAuth = _interopRequireDefault(require("./useAuth"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const AdminDataContext = /*#__PURE__*/_react.default.createContext({});

function useAdminContext() {
  const context = _react.default.useContext(AdminDataContext);

  if (!context) {
    throw new Error('useAdminContext must be used within AdminContext');
  }

  return context;
}

const defaultAccountsUrl = 'https://dev.lolo.company/api/accounts/all';

function AdminContext(props) {
  const {
    data
  } = props;
  const [accounts, setAccounts] = (0, _react.useState)([]);
  const [selectedAccount, setSelectedAccount] = (0, _react.useState)(null);
  const {
    jwtToken
  } = (0, _useAuth.default)();
  (0, _react.useEffect)(() => {
    const getAccounts = async () => {
      const headers = new Headers({
        Accept: 'application/json'
      });
      headers.set('Authorization', jwtToken);
      ra.fetchUtils.fetchJson(data.accountsUrl || defaultAccountsUrl, {
        headers
      }).then(({
        json
      }) => {
        setAccounts(json.accounts);
        setSelectedAccount(getSelectedAccount(json.accounts));
      }).catch(err => {
        if (err.status === 401) data.authProvider.logout();
        throw err;
      });
    };

    if (jwtToken) {
      getAccounts();
    }
  }, [jwtToken]);
  return /*#__PURE__*/_react.default.createElement(AdminDataContext.Provider, {
    value: {
      accounts,
      selectedAccount,
      setSelectedAccount,
      ...data
    }
  }, props.children);
}

const getSelectedAccount = accounts => {
  if (accounts.length < 1) return null;
  const id = localStorage.getItem('accountId');
  const isPrimaryAccount = accounts.find(item => item.isPrimary);

  if (id) {
    return accounts.find(item => item.id === id) || null;
  } else {
    return isPrimaryAccount || accounts[0];
  }
};