"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _Resource = require("./Resource");

var _inflection = require("inflection");

var ra = _interopRequireWildcard(require("react-admin"));

var _CreateActions = _interopRequireDefault(require("./CreateActions"));

var _rjsf = require("./rjsf");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const Create = props => {
  const {
    createSchema
  } = (0, _react.useContext)(_Resource.ResourceContext);
  const controllerData = ra.useCreateController({ ...props
  });
  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_CreateActions.default, props), /*#__PURE__*/_react.default.createElement(ra.TitleForRecord, {
    title: props.title,
    record: controllerData.record,
    defaultTitle: getTitle(createSchema.title || controllerData.resource)
  }), /*#__PURE__*/_react.default.createElement(_rjsf.FormComponent, {
    controllerData: controllerData,
    schema: createSchema
  }));
};

const getTitle = (resource = '') => {
  return 'Create ' + (0, _inflection.titleize)((0, _inflection.singularize)(resource));
};

var _default = Create;
exports.default = _default;