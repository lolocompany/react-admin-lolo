"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _core = require("@material-ui/core");

var _Resource = require("./Resource");

var _inflection = require("inflection");

var ra = _interopRequireWildcard(require("react-admin"));

var _EditActions = _interopRequireDefault(require("./EditActions"));

var _materialUi = _interopRequireDefault(require("@rjsf/material-ui"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const Edit = props => {
  const [formData, setFormData] = (0, _react.useState)({});
  const [hasErrors, setHasErrors] = (0, _react.useState)(true);
  const {
    schema,
    uiSchema
  } = (0, _react.useContext)(_Resource.ResourceContext);
  let form;
  const {
    basePath,
    record,
    resource,
    save,
    saving
  } = ra.useEditController({ ...props
  });
  (0, _react.useEffect)(() => setFormData(record), [record]);
  if (!schema) return null;
  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_EditActions.default, props), /*#__PURE__*/_react.default.createElement(ra.TitleForRecord, {
    title: props.title,
    record: record,
    defaultTitle: getTitle(resource)
  }), /*#__PURE__*/_react.default.createElement(_core.Card, null, /*#__PURE__*/_react.default.createElement(_core.Box, {
    px: 2,
    pb: 1
  }, /*#__PURE__*/_react.default.createElement(_materialUi.default, {
    ref: f => {
      form = f;
    },
    schema: schema,
    uiSchema: {
      id: {
        'ui:readonly': true
      },
      ...uiSchema
    },
    formData: formData,
    showErrorList: false,
    liveValidate: true,
    onChange: ({
      formData,
      errors
    }) => {
      setFormData(formData);
      setHasErrors(!!errors.length);
    },
    onSubmit: ({
      formData
    }) => save(formData)
  }, ' '))), /*#__PURE__*/_react.default.createElement(ra.Toolbar, null, /*#__PURE__*/_react.default.createElement(_core.Box, {
    display: "flex",
    justifyContent: "space-between",
    width: "100%"
  }, /*#__PURE__*/_react.default.createElement(ra.SaveButton, {
    saving: saving,
    disabled: hasErrors,
    handleSubmitWithRedirect: () => form.submit()
  }), /*#__PURE__*/_react.default.createElement(ra.DeleteButton, {
    record: record,
    basePath: basePath,
    resource: resource,
    undoable: false
  }))));
};

const getTitle = (resource, record) => {
  return 'Edit ' + (0, _inflection.titleize)((0, _inflection.singularize)(resource));
};

var _default = Edit;
exports.default = _default;