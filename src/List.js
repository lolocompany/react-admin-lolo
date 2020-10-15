import React, { useContext, Fragment } from 'react';
import * as ra from 'react-admin';
import { ResourceContext }  from './Resource';
import { keyToRef, TextField } from './utils';
import ListActions from './ListActions';
import ListEmpty from './ListEmpty';
import Filter from './Filter';
import { pluralize } from 'inflection';

const ExpandPanel = ({ id, record, resource }) => (
	<pre style={{fontSize: '1.1rem'}}>
		{JSON.stringify(record, null, 2)}
	</pre>
);

const BulkActionButtons = props => (
  <Fragment>
    <ra.BulkDeleteButton {...props} />
  </Fragment>
);

const List = props => {
	const { schema, timestamps } = useContext(ResourceContext);

	if (!schema) return null;

	return (
    <ra.List
    	{...props} 
    	bulkActionButtons={props.hasEdit ? <BulkActionButtons /> : false}
    	filters={<Filter schema={schema} />}
    	actions={<ListActions />}
    	empty={<ListEmpty />}
    	sort={{ field: 'createdAt', order: 'ASC' }}
    	title={schema.title ? pluralize(schema.title) : undefined}
    	>
      <ra.Datagrid
      	rowClick={props.hasShow ? 'show' : props.hasEdit ? 'edit' : null}
      	expand={<ExpandPanel />}
      	>
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

	if (key.endsWith('Id')) return refField(fieldProps);
	if (fieldSchema.enum) return enumField(fieldProps, fieldSchema);

	switch(fieldSchema.type) {
		case 'string':
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
	return (
    <ra.ReferenceField
    	reference={keyToRef(key)}
    	key={key}
    	{...props}
    	>
    	<TextField/>
    </ra.ReferenceField>
	);
};

const enumField = (fieldProps, fieldSchema) => {
	const { enum: _enum, enumNames = []} = fieldSchema;
	const choices = _enum.map((id, i) => ({ id, name: enumNames[i] || id }))
	
	return (
		<ra.SelectField
			{...fieldProps} 
			choices={choices}
			translateChoice={false}
		/>
	);
}

export default List