import React, { useContext } from 'react';
import { ImportButton } from 'react-admin-import-csv';
import { ResourceContext } from './Resource';

export default props => {
	const { schema } = useContext(ResourceContext);

	if (!schema) return;

	return (
	  <ImportButton
	    preCommitCallback={(action, data) => {
	    	/* Typecast properties based on schema */

	    	for (const record of data) {
	    		for (const [ key, val ] of Object.entries(record)) {
		    		const fieldSchema = schema.properties[key] || {};
		    		switch(fieldSchema.type) {
		    			case 'integer':
		    				record[key] = parseInt(val);
		    				break;
		    			case 'number':
		    				record[key] = parseFloat(val);
		    				break;
		    			case 'boolean':
		    				record[key] = JSON.parse(val);
		    				break;
		    			default:
		    		}
		    	}
	    	}
	    	return data;
	    }}
	    postCommitCallback={report => { /* disable concurrency */ }}
	    {...props}
	  />
	);
}