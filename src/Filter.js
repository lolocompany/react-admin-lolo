import React from 'react';
import * as ra from 'react-admin';
import { humanize } from 'inflection';

const Filter = props => {
	return (
	  <ra.Filter {...props}>
      { Object.entries(props.schema.properties).map(toInput) }
	  </ra.Filter>
	);
};

const toInput = ([ key, fieldSchema ]) => {
	const { enum: _enum, enumNames = [] } = fieldSchema;

	if (key.endsWith('Id')) {
		const resource = key.replace(/Id$/, '');
		return (
			<ra.ReferenceInput
				label={humanize(resource)}
				source={key}
				reference={resource + 's'}
				key={key}
				>
    		<ra.SelectInput optionText="name" />
			</ra.ReferenceInput>
		);
	}

	if (_enum) {
		const choices = _enum.map((id, i) => ({ id, name: enumNames[i] || id }));	
		return <ra.SelectInput source={key} choices={choices} key={key}/>
	}

	if (fieldSchema.type === 'boolean') {
		return (
			<ra.BooleanInput
				label={humanize(key)} 
				source={key}
				key={key}
			/>
		);
	}
	
	return (
		<ra.TextInput
			label={humanize(key)}
			source={key}
			key={key}
		/>
	);
};

export default Filter;