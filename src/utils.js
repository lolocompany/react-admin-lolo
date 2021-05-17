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


/*Transforming schema for EDIT/CREATE Resources */

const removeReadonly = schema => {
	const copy = JSON.parse(JSON.stringify(schema));

	traverse(copy).forEach(function() {
		if (this.key === 'readOnly' && this.node === true) {
			this.parent.remove();
		}
	});

	return copy;
}

export const buildEditSchema = (schema, options = {}) => {
	const updatedSchema = removeReadonly(schema)

	if(options.createWithId) {
		updatedSchema.properties = {
			id: schema.properties.id,
			...updatedSchema.properties
		}
	}

	return updatedSchema
}

export const buildCreateSchema = (schema, options = {}) => {
	const updatedSchema = removeReadonly(schema)

	if(options.createWithId) {
		updatedSchema.properties = {
			id: { ...schema.properties.id, readOnly: false },
			...updatedSchema.properties
		};
	}

	return updatedSchema
}

export const buildListSchema = (schema, options = {}) => {
	return removeReadonly(schema)
}