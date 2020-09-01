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
	const { name, timestamps = ['createdAt'] } = props;

	const [ schema, setSchema ] = useState();
	const [ uiSchema, setUiSchema] = useState();
	const { baseUrl } = useContext(AdminContext);

	useEffect(() => {
		const schemaUrl = baseUrl + '/schemas/' + name.replace(/s$/, '');

		/*
		if (name === 'devices') {
			const _schema = JSON.parse(JSON.stringify(cannedSchema));
			const _uiSchema = {};
			enableWidgets(_uiSchema, _schema);
			setSchema(_schema);
			setUiSchema(_uiSchema);
			return;
		}
		*/

		ra.fetchUtils.fetchJson(schemaUrl).then(({ json }) => {
			const { uiSchema = {}, ...schema } = json;
			enableWidgets(uiSchema, schema);

			setSchema(schema);
			setUiSchema(uiSchema);
		});
	}, [ baseUrl, name ]);

	return (
		<ResourceContext.Provider value={{ schema, uiSchema, timestamps }}>
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

export {
	Resource,
	ResourceContext
}