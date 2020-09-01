"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _core = require("@rjsf/core");

var _materialUi = require("@rjsf/material-ui");

var _core2 = require("@material-ui/core");

var _Resource = require("./Resource");

var ra = _interopRequireWildcard(require("react-admin"));

var _CreateActions = _interopRequireDefault(require("./CreateActions"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const Form = (0, _core.withTheme)(_materialUi.Theme);

const Create = props => {
  const [formData, setFormData] = (0, _react.useState)({});
  const [hasErrors, setHasErrors] = (0, _react.useState)(true);
  const [liveValidate, setLiveValidate] = (0, _react.useState)(false);
  const {
    schema,
    uiSchema
  } = (0, _react.useContext)(_Resource.ResourceContext);
  let form;
  const {
    defaultTitle,
    record,
    save,
    saving
  } = ra.useCreateController({ ...props
  });
  if (!schema) return null;
  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_CreateActions.default, props), /*#__PURE__*/_react.default.createElement(ra.TitleForRecord, {
    title: props.title,
    record: record,
    defaultTitle: defaultTitle
  }), /*#__PURE__*/_react.default.createElement(_core2.Card, null, /*#__PURE__*/_react.default.createElement(_core2.Box, {
    px: 2,
    pb: 1
  }, /*#__PURE__*/_react.default.createElement(Form, {
    ref: f => {
      form = f;
    },
    schema: schema,
    uiSchema: uiSchema,
    formData: formData,
    showErrorList: false,
    liveValidate: liveValidate,
    onChange: ({
      formData,
      errors
    }) => {
      console.log('onChange', form && form.state);
      if (!liveValidate) setLiveValidate(true);
      setFormData(formData);
      setHasErrors(!!errors.length);
    },
    onSubmit: ({
      formData
    }) => save(formData)
  }, ' '))), /*#__PURE__*/_react.default.createElement(ra.Toolbar, null, /*#__PURE__*/_react.default.createElement(_core2.Box, {
    display: "flex",
    justifyContent: "space-between",
    width: "100%"
  }, /*#__PURE__*/_react.default.createElement(ra.SaveButton, {
    saving: saving,
    disabled: hasErrors,
    handleSubmitWithRedirect: () => form.submit()
  }))));
};

var _default = Create;
exports.default = _default;