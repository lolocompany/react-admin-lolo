"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactAdminImportCsv = require("react-admin-import-csv");

var _Resource = require("./Resource");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var _default = props => {
  const {
    schema
  } = (0, _react.useContext)(_Resource.ResourceContext);
  if (!schema) return;
  return /*#__PURE__*/_react.default.createElement(_reactAdminImportCsv.ImportButton, _extends({
    preCommitCallback: (action, data) => {
      /* Typecast properties based on schema */
      for (const record of data) {
        for (const [key, val] of Object.entries(record)) {
          const fieldSchema = schema.properties[key] || {};

          switch (fieldSchema.type) {
            case 'integer':
              record[key] = parseInt(val);
              break;

            case 'number':
              record[key] = parseFloat(val);
              break;

            case 'boolean':
              record[key] = JSON.parse(val);
              break;

            default:
          }
        }
      }

      return data;
    },
    postCommitCallback: report => {
      /* disable concurrency */
    }
  }, props));
};

exports.default = _default;