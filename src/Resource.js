import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router';
import * as ra from 'react-admin';
import traverse from 'traverse';

import Create from './Create';
import Edit from './Edit';
import List from './List';
import * as rjsf from './rjsf';
import {deepClone, removeReadonly} from './utils'
import {useAdminContext} from './hooks/useAdminContext'
import { singularize } from 'inflection';

const ResourceContext = React.createContext();

const Resource = props => {
	const { 
		name,
		intent,
		timestamps = ['createdAt'],
		editSchemaTransform = (schema) => ({...schema}),
		createSchemaTransform = (schema) => ({...schema}),
		listSchemaTransform = (schema) => ({...schema}),
	} = props;

	const [ schema, setSchema ] = useState({});
	const [ editSchema, setEditSchema ] = useState({});
	const [ createSchema, setCreateSchema ] = useState({});
	const [ listSchema, setListSchema ] = useState({})
	const { apiUrl, fields, widgets } = useAdminContext();

	useEffect(() => {
		if(intent === 'route') {
			const schemaUrl = apiUrl + '/schemas/' + singularize(name)

			ra.fetchUtils.fetchJson(schemaUrl).then(({ json }) => {
				delete json.additionalProperties
				setSchema(json);

				const updatedJson = removeReadonly(json)
				const editSchema = editSchemaTransform(updatedJson)
				const createSchema = createSchemaTransform(updatedJson)
				const listSchema = listSchemaTransform(updatedJson)
				
				setEditSchema(enableWidgets(editSchema))
				setCreateSchema(enableWidgets(createSchema))
				setListSchema(listSchema)
			});
		}
	}, [ apiUrl, name ]);

	return (
		<ResourceContext.Provider value={{ schema, editSchema, createSchema, listSchema, timestamps, fields, widgets }}>
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

const enableWidgets = (json) => {
	const { uiSchema = {}, ...schema } = deepClone(json)

	traverse(schema).forEach(function() {
		if (/Id$/.test(this.key)) {
			let path = this.path.filter(part => ![ 'properties', 'dependencies' ].includes(part));

			while (path.find(oneOf)) {
				path.splice(path.findIndex(oneOf) - 1, 3);
			}

			traverse(uiSchema).set(path, { 'ui:widget': withRouter(rjsf.ReferenceInputWidget) });
		}
	});

	return { uiSchema, ...schema }
}

export {
	Resource,
	ResourceContext
}