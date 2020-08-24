import React, { useContext } from 'react';
import * as ra from 'react-admin';
import { ResourceContext }  from './Resource';
import Filter from './Filter';

const List = props => {
	const { schema } = useContext(ResourceContext);
	const { timestamps = [ 'createdAt', 'updatedAt' ] } = props;

	if (!schema) return null;

	const name = schema.properties.name ? 'name' : 'id';

	return (
    <ra.List {...props} filters={<Filter schema={schema} />}>
      <ra.Datagrid rowClick='edit'>
      	<ra.TextField source={name} key={name} />
      	{ Object.entries(schema.properties).map(toField) }
      	{ timestamps.map(key => <ra.DateField source={key} key={key}/>)}
      </ra.Datagrid>
    </ra.List>
	);
}

const toField = ([ key, fieldSchema ]) => {
	if (key === 'name') return null;

	switch(fieldSchema.type) {
		case 'string':
			if (key.endsWith('Id')) return refField(key);
			return <ra.TextField source={key} key={key}/>;

		case 'boolean':
			return <ra.BooleanField source={key} key={key}/>

		case 'integer':
		case 'number':
			return <ra.NumberField source={key} key={key}/>
			
		default:
			return null;
	}
};

const refField = key => {
	const name = key.replace(/Id$/, '');

	return (
    <ra.ReferenceField label={name} source='id' reference={name + 's'}>
    	<ra.TextField source='name' />
    </ra.ReferenceField>
	);
};

export default List