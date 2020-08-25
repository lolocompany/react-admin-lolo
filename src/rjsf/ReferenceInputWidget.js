import React, { useContext, useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { singularize, humanize } from 'inflection';
import { AdminContext } from '../Admin';

const ReferenceInputWidget = props => {
	const { dataProvider } = useContext(AdminContext);
	const { id, value, onChange } = props;
	const [ data, setData ] = useState();

	useEffect(() => {
		dataProvider.getList(toResource(id), {}).then(res => setData(res.data));
	}, [ dataProvider, id ]);

	return data ? (
    <FormControl>
      <InputLabel>{toLabel(id)}</InputLabel>
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
		  			{item.name}
		  		</MenuItem>
		  	))}
		  </Select>
		</FormControl>
	) : null;
};

const toResource = id => id.split('_').pop().replace(/Id$/, '') + 's';
const toLabel = id => humanize(singularize(toResource(id)));

export default ReferenceInputWidget
