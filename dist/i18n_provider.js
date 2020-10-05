"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _raI18nPolyglot = _interopRequireDefault(require("ra-i18n-polyglot"));

var _raLanguageEnglish = _interopRequireDefault(require("ra-language-english"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _raI18nPolyglot.default)(locale => _raLanguageEnglish.default, 'en', {
  allowMissing: true
});

exports.default = _default;