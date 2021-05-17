"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var ra = _interopRequireWildcard(require("react-admin"));

var _Resource = require("./Resource");

var _utils = require("./utils");

var _ListActions = _interopRequireDefault(require("./ListActions"));

var _ListEmpty = _interopRequireDefault(require("./ListEmpty"));

var _Filter = _interopRequireDefault(require("./Filter"));

var _inflection = require("inflection");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const ExpandPanel = ({
  id,
  record,
  resource
}) => /*#__PURE__*/_react.default.createElement("pre", {
  style: {
    fontSize: '1.1rem'
  }
}, JSON.stringify(record, null, 2));

const BulkActionButtons = props => /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(ra.BulkDeleteButton, props));

const List = props => {
  const {
    listSchema: schema
  } = (0, _react.useContext)(_Resource.ResourceContext);
  if (!schema) return null;
  console.log(schema, 'schemaaaaa');
  return /*#__PURE__*/_react.default.createElement(ra.List, _extends({}, props, {
    bulkActionButtons: props.hasEdit ? /*#__PURE__*/_react.default.createElement(BulkActionButtons, null) : false,
    filters: /*#__PURE__*/_react.default.createElement(_Filter.default, {
      schema: schema
    }),
    actions: /*#__PURE__*/_react.default.createElement(_ListActions.default, null),
    empty: /*#__PURE__*/_react.default.createElement(_ListEmpty.default, null),
    sort: {
      field: 'createdAt',
      order: 'ASC'
    },
    title: schema.title ? (0, _inflection.pluralize)(schema.title) : undefined
  }), /*#__PURE__*/_react.default.createElement(ra.Datagrid, {
    rowClick: props.hasShow ? 'show' : props.hasEdit ? 'edit' : null,
    expand: props.expand || /*#__PURE__*/_react.default.createElement(ExpandPanel, null)
  }, Object.entries({ ...schema.properties,
    createdAt: {
      type: 'string',
      format: 'date-time'
    }
  }).map(toField)));
};

const toField = ([key, fieldSchema]) => {
  const fieldProps = {
    source: key,
    label: fieldSchema.title,
    key
  };
  if (key.endsWith('Id')) return refField(fieldProps);
  if (fieldSchema.enum) return enumField(fieldProps, fieldSchema);

  switch (fieldSchema.type) {
    case 'string':
      return fieldSchema.format === 'date-time' ? /*#__PURE__*/_react.default.createElement(ra.DateField, _extends({}, fieldProps, {
        showTime: true
      })) : /*#__PURE__*/_react.default.createElement(ra.TextField, fieldProps);

    case 'boolean':
      return /*#__PURE__*/_react.default.createElement(ra.BooleanField, fieldProps);

    case 'integer':
    case 'number':
      return /*#__PURE__*/_react.default.createElement(ra.NumberField, fieldProps);

    default:
      return null;
  }
};

const refField = ({
  key,
  ...props
}) => {
  return /*#__PURE__*/_react.default.createElement(ra.ReferenceField, _extends({
    reference: (0, _utils.keyToRef)(key),
    key: key
  }, props), /*#__PURE__*/_react.default.createElement(_utils.TextField, null));
};

const enumField = (fieldProps, fieldSchema) => {
  const {
    enum: _enum,
    enumNames = []
  } = fieldSchema;

  const choices = _enum.map((id, i) => ({
    id,
    name: enumNames[i] || id
  }));

  return /*#__PURE__*/_react.default.createElement(ra.SelectField, _extends({}, fieldProps, {
    choices: choices,
    translateChoice: false
  }));
};

var _default = List;
exports.default = _default;