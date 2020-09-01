import React from 'react';
import * as ra from 'react-admin';
import { keyToRef } from './utils';

const Filter = props => {
	return (
	  <ra.Filter {...props}>
      { Object.entries(props.schema.properties).map(toInput) }
	  </ra.Filter>
	);
};

const toInput = ([ key, fieldSchema ]) => {
	const { enum: _enum, enumNames = [] } = fieldSchema;
	const fieldProps = {
		label: fieldSchema.title,
		source: key,
		key
	};

	if (key.endsWith('Id')) {
		return (
			<ra.ReferenceInput
				{...fieldProps}
				reference={keyToRef(key)}
				>
    		<ra.SelectInput optionText="name" />
			</ra.ReferenceInput>
		);
	}

	if (_enum) {
		const choices = _enum.map((id, i) => ({ id, name: enumNames[i] || id }));	
		return <ra.SelectInput {...fieldProps} choices={choices}/>
	}

	if (fieldSchema.type === 'boolean') {
		return <ra.BooleanInput {...fieldProps} />
	}
	
	return (
		<ra.TextInput {...fieldProps} />
	);
};

export default Filter;