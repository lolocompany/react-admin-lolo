import React from 'react';
import * as ra from 'react-admin';
import _dataProvider from './data_provider';
import {authProvider, AuthProvider} from './auth_provider';
import i18nProvider from './i18n_provider';
import LoginPage from './LoginPage.js';
import './Admin.css';
import {AdminContext} from './hooks/useAdminContext'
import AppBarDropdown from './components/AppBarDropdown'

const Admin = ({
  fields = {},
  widgets = {},
  apiUrl,
  accountsUrl,
  ...props
}) => {
  const dataProvider = props.dataProvider || _dataProvider(apiUrl);

  if(props.authProvider) {
    new AuthProvider(props.authProvider)
  }

  const RAdmin = () => (
    <ra.Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      i18nProvider={i18nProvider}
      loginPage={LoginPage}
      title='Lolo Admin'
      logoutButton={AppBarDropdown}
      {...props}
      >
      { props.children }
    </ra.Admin>
  )

  return (
    <AdminContext data={{ 
      accountsUrl,
      authProvider,
      dataProvider,
      fields,
      widgets
    }}>
      <RAdmin />
    </AdminContext>
  );
};

export {
  Admin
}
