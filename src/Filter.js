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
	const fieldProps = {
		label: fieldSchema.title,
		source: key,
		key
	};

	if (key.endsWith('Id')) {
		const resource = key.replace(/Id$/, '');
		return (
			<ra.ReferenceInput
				{...fieldProps}
				reference={resource + 's'}
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