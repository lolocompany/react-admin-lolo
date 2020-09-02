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
	const fieldProps = {
		label: fieldSchema.title,
		source: key,
		key
	};

	if (key.endsWith('Id')) return refInput(fieldProps);
	if (fieldSchema.enum) return enumInput(fieldProps, fieldSchema);

	switch(fieldSchema.type) {
		case 'string':
			return <ra.TextInput {...fieldProps}/>;

		case 'boolean':
			return <ra.BooleanInput {...fieldProps} />

		case 'integer':
		case 'number':
			return <ra.NumberInput {...fieldProps}/>
			
		default:
			return null;
	}
};

const refInput = ({ key, ...props }) => {
	return (
		<ra.ReferenceInput
			{...props}
			reference={keyToRef(key)}
			>
  		<ra.SelectInput optionText="name" />
		</ra.ReferenceInput>
	);
};

const enumInput = (fieldProps, fieldSchema) => {
	const { enum: _enum, enumNames = []} = fieldSchema;
	const choices = _enum.map((id, i) => ({ id, name: enumNames[i] || id }));

	return (
		<ra.SelectInput
			{...fieldProps} 
			choices={choices}
		/>
	);
}


export default Filter;