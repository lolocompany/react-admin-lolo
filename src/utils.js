import { transform } from 'inflection';

export const keyToRef = key => transform(
	key.replace(/Id$/, ''), [ 'underscore', 'dasherize', 'pluralize' ]
);