"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _materialUi = _interopRequireDefault(require("@rjsf/material-ui"));

var _core = require("@material-ui/core");

var _Resource = require("./Resource");

var _inflection = require("inflection");

var ra = _interopRequireWildcard(require("react-admin"));

var _CreateActions = _interopRequireDefault(require("./CreateActions"));

var _CustomToolbar = _interopRequireDefault(require("./components/CustomToolbar"));

var _utils = require("../dist/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const Create = props => {
  const [formData, setFormData] = (0, _react.useState)({});
  const [schemaState, setSchemaState] = (0, _react.useState)({});
  const [hasErrors, setHasErrors] = (0, _react.useState)(true);
  const {
    createSchema,
    widgets,
    fields
  } = (0, _react.useContext)(_Resource.ResourceContext);
  const {
    uiSchema = {},
    ...schema
  } = createSchema;
  let form;
  const {
    defaultTitle,
    record,
    resource,
    save,
    saving
  } = ra.useCreateController({ ...props
  });

  function usePrevious(value) {
    const ref = _react.default.useRef();

    if (!(0, _utils.isEqual)(ref.current, value)) {
      ref.current = value;
    }

    return ref.current;
  }

  (0, _react.useEffect)(() => {
    if (schema) {
      const {
        $id,
        ...restSchema
      } = schema;
      setSchemaState(restSchema);
    }
  }, [createSchema]);
  (0, _react.useEffect)(() => {
    if (form) {
      setHasErrors(!!form.state.errors.length);
    }
  }, usePrevious(form));
  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_CreateActions.default, props), /*#__PURE__*/_react.default.createElement(ra.TitleForRecord, {
    title: props.title,
    record: record,
    defaultTitle: getTitle(schemaState.title || resource)
  }), /*#__PURE__*/_react.default.createElement(_core.Card, null, /*#__PURE__*/_react.default.createElement(_core.Box, {
    px: 2,
    pb: 1
  }, /*#__PURE__*/_react.default.createElement(_materialUi.default, {
    ref: f => {
      form = f;
    },
    schema: schemaState || {},
    uiSchema: uiSchema,
    formData: formData,
    showErrorList: false,
    liveValidate: true,
    fields: fields,
    widgets: widgets,
    onChange: ({
      formData
    }) => {
      setFormData(formData);
    }
  }, ' '))), /*#__PURE__*/_react.default.createElement(_CustomToolbar.default, null, /*#__PURE__*/_react.default.createElement(_core.Box, {
    display: "flex",
    justifyContent: "space-between",
    width: "100%"
  }, /*#__PURE__*/_react.default.createElement(ra.SaveButton, {
    saving: saving,
    disabled: hasErrors,
    handleSubmitWithRedirect: () => save(formData)
  }))));
};

const getTitle = (resource = '') => {
  return 'Create ' + (0, _inflection.titleize)((0, _inflection.singularize)(resource));
};

var _default = Create;
exports.default = _default;