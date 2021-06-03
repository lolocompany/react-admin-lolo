import React from 'react'
import {Logout, useRefresh} from 'react-admin';
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew';
import {List, ListSubheader, ListItem, Divider, makeStyles } from '@material-ui/core'
import {useAdminContext} from '../hooks/useAdminContext'

const useStyles = makeStyles((theme) => ({
  dropdown: {
    width: 200,
    overflow: 'auto'
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

const AppBarDropdown = (props) => {
  const {accounts, selectedAccount, setSelectedAccount} = useAdminContext()
  const classes = useStyles()
  const refresh = useRefresh()

	const handleAccountSelect = account => {
		const selectedAcc = accounts.find(item => item.id === account.id);

    if (selectedAcc.isPrimary) {
      localStorage.removeItem('accountId');
    } else {
      localStorage.setItem('accountId', account.id);
    }

    refresh()
		setSelectedAccount(account)
	}

	const selectedAccountId = selectedAccount ? selectedAccount.id : ''
	return (
		<div className={classes.dropdown}>
			<List>
				<ListSubheader>Accounts</ListSubheader>
			{
				 accounts.map((account, i) => (
					<ListItem key={i}
						button
						value={account.id}
						selected={account.id === selectedAccountId}
						disabled={account.id === selectedAccountId}
						onClick={() => handleAccountSelect(account)}
					>
						{account.name}
					</ListItem>
				))
			}
        <div className={classes.divider}>
          <Divider light />
        </div>
        <Logout {...props} icon={<PowerSettingsNew/>} />
			</List>
		</div>
	)
}

export default AppBarDropdown