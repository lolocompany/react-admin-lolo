"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAdminContext = useAdminContext;
exports.AdminContext = AdminContext;

var _react = _interopRequireWildcard(require("react"));

var ra = _interopRequireWildcard(require("react-admin"));

var _auth = _interopRequireDefault(require("@aws-amplify/auth"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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
  const [accounts, setAccounts] = (0, _react.useState)([]);
  const [selectedAccount, setSelectedAccount] = (0, _react.useState)(null);
  const {
    data
  } = props;
  (0, _react.useEffect)(() => {
    const getAccounts = async () => {
      const session = await _auth.default.currentSession();
      let headers = new Headers({
        Accept: 'application/json'
      });
      headers.set('Authorization', session.idToken.jwtToken);
      ra.fetchUtils.fetchJson(data.accountsUrl || defaultAccountsUrl, {
        headers
      }).then(({
        json
      }) => {
        setAccounts(json.accounts);
        setSelectedAccount(getSelectedAccount(json.accounts));
      }).catch(e => {
        if (localStorage.getItem('accountId')) {
          localStorage.removeItem('accountId');
        }

        throw e;
      });
    };

    if (!accounts.length) {
      getAccounts();
    }
  }, []);
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
  const id = localStorage.getItem('accountId');
  let account;

  if (id) {
    account = accounts.find(item => item.id === id);
    if (account) return account;
    localStorage.removeItem('accountId');
  }

  return accounts.find(item => item.isPrimary);
};