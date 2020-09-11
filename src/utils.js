import React from 'react';
import * as ra from 'react-admin';
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