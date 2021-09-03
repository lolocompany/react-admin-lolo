import React, { useEffect, useState } from 'react';
import * as ra from 'react-admin';
import { useAuth } from './';

const AdminDataContext = React.createContext({});

function useAdminContext() {
  const context = React.useContext(AdminDataContext);

  if (!context) {
    throw new Error('useAdminContext must be used within AdminContext');
  }

  return context;
}

const defaultAccountsUrl = 'https://dev.lolo.company/api/accounts/all';

function AdminContext(props) {
  const { data } = props;
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const { jwtToken } = useAuth();
  const refresh = ra.useRefresh();

  useEffect(() => {
    const getAccounts = async () => {
      const headers = new Headers({ Accept: 'application/json' });
      headers.set('Authorization', jwtToken);

      ra.fetchUtils
        .fetchJson(data.accountsUrl || defaultAccountsUrl, {
          headers,
        })
        .then(({ json }) => {
          setAccounts(json.accounts);
          setSelectedAccount(getSelectedAccount(json.accounts, refresh));
        })
        .catch(err => {
          if (err.status === 401) data.authProvider.logout();
          throw err;
        });
    };

    if (jwtToken) {
      getAccounts();
    }
  }, [jwtToken]);

  return (
    <AdminDataContext.Provider
      value={{
        accounts,
        selectedAccount,
        setSelectedAccount,
        ...data,
      }}
    >
      {props.children}
    </AdminDataContext.Provider>
  );
}

const getSelectedAccount = (accounts, refresh) => {
  if (accounts.length < 1) return null;

  const id = localStorage.getItem('accountId');
  const isPrimaryAccount = accounts.find(item => item.isPrimary);

  if (id) {
    return accounts.find(item => item.id === id) || null;
  } else {
    if (isPrimaryAccount) {
      return isPrimaryAccount;
    } else {
      localStorage.setItem('accountId', accounts[0].id);
      refresh();
      return accounts[0];
    }
  }
};

export { useAdminContext, AdminContext };
