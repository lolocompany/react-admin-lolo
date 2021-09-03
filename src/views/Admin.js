import React from 'react';
import * as ra from 'react-admin';
import { Provider } from 'react-redux';
import { createHashHistory } from 'history';
import {
  dataProvider as _dataProvider,
  authProvider,
  AuthProvider,
  i18nProvider,
} from '../providers';
import { createAdminStore } from '../helpers';
import { LoginPage } from '../views';
import { AdminContext } from '../hooks/useAdminContext';
import { AppBarDropdown } from '../components';
import '../styles/Admin.css';

const history = createHashHistory();

const Admin = ({ fields = {}, widgets = {}, apiUrl, accountsUrl, ...props }) => {
  const dataProvider = props.dataProvider || _dataProvider(apiUrl);

  if (props.authProvider) {
    new AuthProvider(props.authProvider);
  }

  const RAdmin = () => (
    <ra.Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      i18nProvider={i18nProvider}
      history={history}
      loginPage={LoginPage}
      title="Lolo Admin"
      logoutButton={AppBarDropdown}
      theme={ra.defaultTheme}
      {...props}
    >
      {props.children}
    </ra.Admin>
  );

  return (
    <Provider
      store={createAdminStore({
        authProvider,
        dataProvider,
        history,
      })}
    >
      <AdminContext
        data={{
          accountsUrl,
          authProvider,
          dataProvider,
          fields,
          widgets,
        }}
      >
        <RAdmin />
      </AdminContext>
    </Provider>
  );
};

export { Admin };
