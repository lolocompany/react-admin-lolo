import React, { useEffect, useState } from 'react'
import * as ra from 'react-admin';
import Auth from '@aws-amplify/auth';

const AdminDataContext = React.createContext({})

function useAdminContext () {
  const context = React.useContext(AdminDataContext)
  if(!context){
    throw new Error('useAdminContext must be used within AdminContext')
  }

  return context
}

function AdminContext (props) {
  const [accounts, setAccounts] = useState([])
  const [selectedAccount, setSelectedAccount] = useState(null)
  const {data} = props

  useEffect(() => {
     const getAccounts = async () => {
			const session = await Auth.currentSession();
		
			let headers = new Headers({Accept: 'application/json'})
			headers.set('Authorization', session.idToken.jwtToken)

			ra.fetchUtils.fetchJson('https://dev.lolo.company/api/accounts/all', {
				headers
			}).then(({ json }) => {
				setAccounts(json.accounts)
        setSelectedAccount(getSelectedAccount(json.accounts))
			}).catch(e => {
        if (localStorage.getItem('accountId')) {
          localStorage.removeItem('accountId');
        }
        throw e
			})
		}

		if(!accounts.length) {
			getAccounts()
		}
  }, [])
 
  return (
    <AdminDataContext.Provider
      value={{
        accounts,
        selectedAccount,
        setSelectedAccount,
        ...data
      }}
    >
      {props.children}
    </AdminDataContext.Provider>
  )
}

export {useAdminContext, AdminContext}

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