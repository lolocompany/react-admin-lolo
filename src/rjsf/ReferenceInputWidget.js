import React, { useContext, useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { AdminContext } from '../Admin';
import { keyToRef } from '../utils';

const ReferenceInputWidget = props => {
	const { dataProvider } = useContext(AdminContext);
	const { id, value, onChange, schema } = props;
	const [ data, setData ] = useState();

	useEffect(() => {
		const reference = keyToRef(id.split('_').pop()); // root_...
		dataProvider.getList(reference, {}).then(res => setData(res.data));
	}, [ dataProvider, id ]);

	return data ? (
    <FormControl>
      <InputLabel>{schema.title || id}</InputLabel>
		  <Select
		    labelId={id}
		    id={id}
		    value={value}
		    onChange={ev => onChange(ev.target.value)}
		  	>
		  	{ data.map(item => (
		  		<MenuItem
		  			value={item.id} 
		  			key={item.id}>
		  			{item.name || item.id}
		  		</MenuItem>
		  	))}
		  </Select>
		</FormControl>
	) : null;
};

export default ReferenceInputWidget
