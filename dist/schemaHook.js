"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

const ResourceSchemaContext = React.createContext();

function useResourceSchema() {
  const context = /*#__PURE__*/(0, _react.createContext)(ResourceSchemaContext);
}

const SchemaHook = () => {
  return /*#__PURE__*/React.createElement("div", null, "schema hook");
};

var _default = SchemaHook;
exports.default = _default;