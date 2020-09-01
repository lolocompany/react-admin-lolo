"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keyToRef = void 0;

var _inflection = require("inflection");

const keyToRef = key => (0, _inflection.transform)(key.replace(/Id$/, ''), ['underscore', 'dasherize', 'pluralize']);

exports.keyToRef = keyToRef;