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
	const { apiUrl, fields, widgets } = useContext(AdminContext);

	useEffect(() => {
		const schemaUrl = apiUrl + '/schemas/' + name.replace(/s$/, '');

		ra.fetchUtils.fetchJson(schemaUrl).then(({ json }) => {
			const { uiSchema = {}, ...schema } = json;
			enableWidgets(uiSchema, schema);

			delete schema.additionalProperties;
			setSchema(schema);
			setUiSchema(uiSchema);
		
			const editSchema = removeReadonly(schema);
			const createSchema = removeReadonly(schema);

			if (createWithId) {
				editSchema.properties = {
					id: schema.properties.id,
					...createSchema.properties
				};
				createSchema.properties = {
					id: { ...schema.properties.id, readOnly: false },
					...createSchema.properties
				};
			}

			setEditSchema(editSchema);
			setCreateSchema(createSchema);
		});
	}, [ apiUrl, name ]);

	return (
		<ResourceContext.Provider value={{ schema, editSchema, createSchema, uiSchema, timestamps, fields, widgets }}>
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
			const path = this.path.indexOf('dependencies') >= 0 ?
				this.path.slice(-1) :
				this.path.filter(item => item !== 'properties');

			traverse(uiSchema).set(path, { 'ui:widget': rjsf.ReferenceInputWidget });
		}
	});
}

const removeReadonly = schema => {
	const copy = JSON.parse(JSON.stringify(schema));

	traverse(copy).forEach(function() {
		if (this.key === 'readOnly') {
			this.parent.remove();
		}
	});

	return copy;
}


export {
	Resource,
	ResourceContext
}