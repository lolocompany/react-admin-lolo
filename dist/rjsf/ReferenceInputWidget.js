"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _core = require("@material-ui/core");

var _inflection = require("inflection");

var _Admin = require("../Admin");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const ReferenceInputWidget = props => {
  const {
    dataProvider
  } = (0, _react.useContext)(_Admin.AdminContext);
  const {
    id,
    value,
    onChange
  } = props;
  const [data, setData] = (0, _react.useState)();
  (0, _react.useEffect)(() => {
    dataProvider.getList(toResource(id), {}).then(res => setData(res.data));
  }, [dataProvider, id]);
  return data ? /*#__PURE__*/_react.default.createElement(_core.FormControl, null, /*#__PURE__*/_react.default.createElement(_core.InputLabel, null, toLabel(id)), /*#__PURE__*/_react.default.createElement(_core.Select, {
    labelId: id,
    id: id,
    value: value,
    onChange: ev => onChange(ev.target.value)
  }, data.map(item => /*#__PURE__*/_react.default.createElement(_core.MenuItem, {
    value: item.id,
    key: item.id
  }, item.name)))) : null;
};

const toResource = id => (0, _inflection.transform)(id.split('_').pop().replace(/Id$/, '') + 's', ['underscore', 'dasherize']);

const toLabel = id => (0, _inflection.transform)(toResource(id), ['humanize', 'singularize']);

var _default = ReferenceInputWidget;
exports.default = _default;