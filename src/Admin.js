import React from 'react';
import * as ra from 'react-admin';
import { withAuthenticator } from '@aws-amplify/ui-react';
import dataProvider from './data_provider';
import authProvider from './auth_provider';

const AdminContext = React.createContext({});

const Admin = ({ appId, env = 'dev', ...props }) => {
	const baseUrl = `https://${env}.lolo.company/${appId}`;

	const RAdmin = withAuthenticator(() => (
		<ra.Admin
			dataProvider={dataProvider(baseUrl)}
			authProvider={authProvider}
			title='Lolo Admin'
			{...props}
			>
			{ props.children }
		</ra.Admin>
	));

	return (
		<AdminContext.Provider value={{ baseUrl }}>
			<RAdmin />
		</AdminContext.Provider>
	);
};

export {
	Admin,
	AdminContext
}