import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router';
import * as ra from 'react-admin';
import traverse from 'traverse';

import Create from './Create';
import Edit from './Edit';
import List from './List';
import * as rjsf from './rjsf';
import {buildCreateSchema, buildEditSchema} from './utils'
import {useAdminContext} from './hooks/useAdminContext'
import { singularize } from 'inflection';

const ResourceContext = React.createContext();

const Resource = props => {
	const { 
		name,
		intent,
		timestamps = ['createdAt'],
		createWithId,
		editSchemaTransform = schema => buildEditSchema(schema),
		createSchemaTransform = schema => buildCreateSchema(schema),
	} = props;

	const [ schema, setSchema ] = useState();
	const [ editSchema, setEditSchema ] = useState();
	const [ createSchema, setCreateSchema ] = useState();
	const [ uiSchema, setUiSchema] = useState();
	const { apiUrl, fields, widgets } = useAdminContext();

	useEffect(() => {
		if(intent === 'route') {
			const schemaUrl = apiUrl + '/schemas/' + singularize(name)

			ra.fetchUtils.fetchJson(schemaUrl).then(({ json }) => {
				const { uiSchema = {}, ...schema } = json;
				enableWidgets(uiSchema, schema);

				delete schema.additionalProperties;
				setSchema(schema);
				setUiSchema(uiSchema);
			
				const editSchema = editSchemaTransform(schema)
				const createSchema = createSchemaTransform(schema);

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
		}
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

const oneOf = part => part === 'oneOf';

const enableWidgets = (uiSchema, schema) => {
	traverse(schema).forEach(function() {
		if (/Id$/.test(this.key)) {
			let path = this.path.filter(part => ![ 'properties', 'dependencies' ].includes(part));

			while (path.find(oneOf)) {
				path.splice(path.findIndex(oneOf) - 1, 3);
			}

			traverse(uiSchema).set(path, { 'ui:widget': withRouter(rjsf.ReferenceInputWidget) });
		}
	});
}

export {
	Resource,
	ResourceContext
}