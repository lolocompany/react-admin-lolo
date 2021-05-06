import React from 'react';
import * as ra from 'react-admin';
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew';
import _dataProvider from './data_provider';
import authProvider from './auth_provider';
import i18nProvider from './i18n_provider';
import LoginPage from './LoginPage.js';
import './Admin.css';
import Auth from '@aws-amplify/auth';
import {List, ListSubheader, ListItem, Divider } from '@material-ui/core'

const CustomAppbarDropdown = (props) => {
	console.log(props, 'props')
	const [accounts, setAccounts] = React.useState([])

	React.useEffect(() => {
    const getAccounts = async () => {
			const session = await Auth.currentSession();
		
			let headers = new Headers({Accept: 'application/json'})
			headers.set('Authorization', session.idToken.jwtToken)

			ra.fetchUtils.fetchJson('https://dev.lolo.company/api/accounts/all', {
				headers
			}).then(({ json }) => {
				setAccounts(json.accounts)
			}).catch(e => {
				console.log(e)
			})
		}

		if(!accounts.length) {
			getAccounts()
		}
	}, [])

	return (
		<div style={{width:200, overflow:'auto'}}>
			<List>
				<ListSubheader>Accounts</ListSubheader>
			{
				accounts.map((v, i) => (
					<ListItem button key={i}>
						{v.name}
					</ListItem>
				))
			}
			<Divider light />
			<ra.Logout {...props} icon={<PowerSettingsNew/>} />
			</List>
		</div>
	)
}

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
			logoutButton={CustomAppbarDropdown}
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