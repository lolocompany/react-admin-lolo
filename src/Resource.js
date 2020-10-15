import React from 'react';
import { useState, useEffect, useContext } from 'react';
import * as ra from 'react-admin';
import traverse from 'traverse';

import Create from './Create';
import Edit from './Edit';
import List from './List';
import * as rjsf from './rjsf';
import { AdminContext } from './Admin';

const ResourceContext = React.createContext();

const Resource = props => {
	const { name, timestamps = ['createdAt'], createWithId } = props;

	const [ schema, setSchema ] = useState();
	const [ editSchema, setEditSchema ] = useState();
	const [ createSchema, setCreateSchema ] = useState();
	const [ uiSchema, setUiSchema] = useState();
	const { apiUrl } = useContext(AdminContext);

	useEffect(() => {
		const schemaUrl = apiUrl + '/schemas/' + name.replace(/s$/, '');

		ra.fetchUtils.fetchJson(schemaUrl).then(({ json }) => {
			const { uiSchema = {}, ...schema } = json;
			enableWidgets(uiSchema, schema);

			delete schema.additionalProperties;
			setSchema(schema);
			setUiSchema(uiSchema);
		
			const except = createWithId ? [ 'properties.id' ] : [];
			const editSchema = removeReadonly(schema, except);
			const createSchema = removeReadonly(schema, except);

			if (createWithId) {
				createSchema.properties.id.readOnly = false;
			}

			setEditSchema(editSchema);
			setCreateSchema(createSchema);
		});
	}, [ apiUrl, name ]);

	return (
		<ResourceContext.Provider value={{ schema, editSchema, createSchema, uiSchema, timestamps }}>
			<ra.Resource
				list={List}
				create={Create}
				edit={Edit}
				{...props}
			/>
		</ResourceContext.Provider>
	);
};

const enableWidgets = (uiSchema, schema) => {
	traverse(schema).forEach(function() {
		if (/Id$/.test(this.key)) {
			const path = this.path.filter(item => item !== 'properties');
			traverse(uiSchema).set(path, { 'ui:widget': rjsf.ReferenceInputWidget });
		}
	});
}

const removeReadonly = (schema, except = []) => {
	const copy = JSON.parse(JSON.stringify(schema));

	traverse(copy).forEach(function() {
		const path = this.parent ? this.parent.path.join('.') : '';
		if (this.key === 'readOnly' && !except.includes(path)) {
			this.parent.remove();
		}
	});

	return copy;
}


export {
	Resource,
	ResourceContext
}