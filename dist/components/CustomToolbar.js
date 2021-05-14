"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _core = require("@material-ui/core");

var _styles = require("@material-ui/core/styles");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const useStyles = (0, _styles.makeStyles)(theme => ({
  toolbarStyle: {
    backgroundColor: theme.palette.grey[100],
    marginTop: theme.spacing(2)
  }
}));

const CustomToolbar = props => {
  const classes = useStyles();
  return /*#__PURE__*/_react.default.createElement(_core.Toolbar, {
    className: classes.toolbarStyle
  }, props.children);
};

var _default = CustomToolbar;
exports.default = _default;