import React, { useContext } from 'react';
import * as ra from 'react-admin';
import { transform } from 'inflection';
import { ResourceContext }  from './Resource';
import ListActions from './ListActions';
import ListEmpty from './ListEmpty';
import Filter from './Filter';

const List = props => {
	const { schema, timestamps } = useContext(ResourceContext);

	if (!schema) return null;

	return (
    <ra.List
    	{...props} 
    	filters={<Filter schema={schema} />}
    	actions={<ListActions />}
    	empty={<ListEmpty />}
    	>
      <ra.Datagrid rowClick={props.hasShow ? 'show' : 'edit'}>
      	{ Object.entries(schema.properties).map(toField) }
      	{ timestamps.map(key => <ra.DateField source={key} key={key}/>)}
      </ra.Datagrid>
    </ra.List>
	);
}

const toField = ([ key, fieldSchema ]) => {
	const fieldProps = {
		source: key,
		label: fieldSchema.title,
		key
	}

	switch(fieldSchema.type) {
		case 'string':
			if (key.endsWith('Id')) return refField(fieldProps);
			if (fieldSchema.enum) return enumField(fieldProps, fieldSchema);
			return <ra.TextField {...fieldProps}/>;

		case 'boolean':
			return <ra.BooleanField {...fieldProps}/>

		case 'integer':
		case 'number':
			return <ra.NumberField {...fieldProps}/>
			
		default:
			return null;
	}
};

const refField = ({ key, ...props }) => {
	const ref = transform(key.replace(/Id$/, '') + 's', [ 'underscore', 'dasherize' ])
	return (
    <ra.ReferenceField
    	reference={ref}
    	key={key}
    	{...props}
    	>
    	<ra.TextField source='name' />
    </ra.ReferenceField>
	);
};

const enumField = (fieldProps, fieldSchema) => {
	const { enum: _enum, enumNames = []} = fieldSchema;
	return (
		<ra.SelectField
			{...fieldProps} 
			choices={_enum.map((id, i) => ({
				id, name: enumNames[i] || id
			}))}
			translateChoice={false}
			/>
	);
}

export default List