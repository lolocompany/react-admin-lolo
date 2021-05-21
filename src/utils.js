import React from 'react';
import * as ra from 'react-admin';
import traverse from 'traverse';
import { transform } from 'inflection';

export const keyToRef = key => transform(
	key.replace(/Id$/, ''), [ 'underscore', 'dasherize', 'pluralize' ]
);

/* HOCs for using either name or id as label */

export const TextField = props => {
	const source = props.record.name ? 'name' : 'id';
	return <ra.TextField {...props} source={source} />
};

export const SelectInput = props => {
	const optionText = props.choices[0].name ? 'name' : 'id';
	return <ra.SelectInput {...props} optionText={optionText} />
}

export const isEqual = (a, b) => {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const deepClone = (value) => {
	return JSON.parse(JSON.stringify(value))
}

export const removeReadonly = json => {
	const {uiSchema = {}, ...schema } = deepClone(json)

	traverse(schema).forEach(function() {
		if (this.key === 'readOnly' && this.node === true) {
			this.parent.remove();
		}
	});

	return {uiSchema, ...schema };
}