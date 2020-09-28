import React from 'react';
import * as ra from 'react-admin';
import { withAuthenticator } from '@aws-amplify/ui-react';
import _dataProvider from './data_provider';
import authProvider from './auth_provider';
import './Admin.css';

const AdminContext = React.createContext({});

const Admin = ({ apiUrl, ...props }) => {
	const dataProvider = _dataProvider(apiUrl);

	const RAdmin = withAuthenticator(() => (
		<ra.Admin
			dataProvider={dataProvider}
			authProvider={authProvider}
			title='Lolo Admin'
			{...props}
			>
			{ props.children }
		</ra.Admin>
	));

	return (
		<AdminContext.Provider value={{ baseUrl, dataProvider }}>
			<RAdmin />
		</AdminContext.Provider>
	);
};

export {
	Admin,
	AdminContext
}