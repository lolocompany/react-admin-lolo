import React from 'react';
import * as ra from 'react-admin';
import { withAuthenticator } from '@aws-amplify/ui-react';
import _dataProvider from './data_provider';
import authProvider from './auth_provider';
import './Admin.css';

const AdminContext = React.createContext({});

const Admin = ({ appId, env = 'dev', ...props }) => {
	const baseUrl = `https://${env}.lolo.company/${appId}`;
	const dataProvider = _dataProvider(baseUrl);

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