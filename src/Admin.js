import React from 'react';
import * as ra from 'react-admin';
import _dataProvider from './data_provider';
import authProvider from './auth_provider';
import i18nProvider from './i18n_provider';
import LoginPage from './LoginPage.js';
import './Admin.css';

const AdminContext = React.createContext({});

const Admin = ({ apiUrl, fields = {}, widgets = {}, ...props }) => {
	const dataProvider = _dataProvider(apiUrl);

	const RAdmin = () => (
		<ra.Admin
			dataProvider={dataProvider}
			authProvider={authProvider}
			i18nProvider={i18nProvider}
			loginPage={LoginPage}
			title='Lolo Admin'
			{...props}
			>
			{ props.children }
		</ra.Admin>
)

	return (
		<AdminContext.Provider value={{ apiUrl, dataProvider, fields, widgets }}>
			<RAdmin />
		</AdminContext.Provider>
	);
};

export {
	Admin,
	AdminContext
}