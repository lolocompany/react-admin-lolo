"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactAdmin = require("react-admin");

var _inflection = require("inflection");

var _ArrayField = _interopRequireDefault(require("@rjsf/core/lib/components/fields/ArrayField"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const ReferenceManyField = props => {
  const [items, setItems] = (0, _react.useState)([]);
  const dataProvider = (0, _reactAdmin.useDataProvider)();
  const typeCamel = props.name.replace(/Ids$/, '');
  const typeCamelPlural = (0, _inflection.transform)(typeCamel, ['pluralize']);
  const typeDashPlural = (0, _inflection.transform)(typeCamelPlural, ['underscore', 'dasherize']);
  (0, _react.useEffect)(() => {
    dataProvider.sendRequest('/' + typeDashPlural).then(res => setItems(res.data[typeCamelPlural]));
  }, [dataProvider]);
  props.schema.uniqueItems = true;
  props.schema.items.enum = items.map(item => item.id);
  props.schema.items.enumNames = items.map(item => item.name);
  return /*#__PURE__*/_react.default.createElement(_ArrayField.default, props);
};

var _default = ReferenceManyField;
exports.default = _default;