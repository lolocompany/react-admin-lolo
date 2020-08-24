import React from 'react';
import { useState, useEffect, useContext } from 'react';
import * as ra from 'react-admin';

import Create from './Create';
import Edit from './Edit';
import List from './List';
import { AdminContext } from './Admin';

const ResourceContext = React.createContext();

const Resource = props => {
	const { name } = props;

	const [ schema, setSchema ] = useState();
	const [ uiSchema, setUiSchema] = useState();
	const { baseUrl } = useContext(AdminContext);

	useEffect(() => {
		const schemaUrl = baseUrl + '/schemas/' + name.replace(/s$/, '');

		ra.fetchUtils.fetchJson(schemaUrl).then(({ json }) => {
			const { uiSchema = {}, ...schema } = json;
			setSchema(schema);
			setUiSchema(uiSchema);
		});
	}, [ baseUrl, name ]);

	return (
		<ResourceContext.Provider value={{ schema, uiSchema }}>
			<ra.Resource
				list={List}
				create={Create}
				edit={Edit}
				{...props}
			/>
		</ResourceContext.Provider>
	);
};

export {
	Resource,
	ResourceContext
}