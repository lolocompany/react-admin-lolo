import React from 'react';
import * as ra from 'react-admin';
import { keyToRef, SelectInput } from '../utils';
import { ReferenceInputWidget }  from '../rjsf';

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

	if (key.endsWith('Id')) return <RefInput {...fieldProps}/>
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

const RefInput = ({ source, label }) => {
	const { setFilters, filterValues } = ra.useListContext();
	return (
		<ReferenceInputWidget
			id={source}
			schema={{
				title: label
			}}
			onChange={value => {
				setFilters({
					...filterValues,
					[source]: value
				})
			}}
			variant='filled'
			value={filterValues[source]}
			showCreate={false}
		/>
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