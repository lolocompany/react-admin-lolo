import React from 'react';
import * as ra from 'react-admin';
import _dataProvider from './data_provider';
import authProvider from './auth_provider';
import i18nProvider from './i18n_provider';
import LoginPage from './LoginPage.js';
import './Admin.css';
import {AdminContext} from './hooks/useAdminContext'
import AppBarDropdown from './components/AppBarDropdown'

const Admin = ({ apiUrl, accountsUrl, fields = {}, widgets = {}, ...props }) => {
	const dataProvider = _dataProvider(apiUrl);

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
		<AdminContext data={{apiUrl, accountsUrl, dataProvider, fields, widgets}}>
			<RAdmin />
		</AdminContext>
	);
};

export {
	Admin
}
