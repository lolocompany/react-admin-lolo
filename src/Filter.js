import React from 'react';
import * as ra from 'react-admin';

const Filter = props => {
	return (
	  <ra.Filter {...props}>
      { Object.entries(props.schema.properties).map(toInput) }
	  </ra.Filter>
	);
};

const toInput = ([ key, fieldSchema ]) => {
	const { enum: _enum, enumNames = [] } = fieldSchema;

	if (_enum) {
		const choices = _enum.map((id, i) => ({ id, name: enumNames[i] || id }));	
		return <ra.SelectInput source={key} choices={choices} key={key}/>
	
	} else {
		return <ra.TextInput label={key} source={key} key={key} />
	}
};

export default Filter;