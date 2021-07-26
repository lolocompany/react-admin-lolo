import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

export default polyglotI18nProvider(
	locale => englishMessages,
	'en',
	{ allowMissing: true }
);