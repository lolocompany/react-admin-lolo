"use strict";

var _raI18nPolyglot = _interopRequireDefault(require("ra-i18n-polyglot"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const i18nProvider = (0, _raI18nPolyglot.default)(locale => {}, 'en', {
  allowMissing: true
});