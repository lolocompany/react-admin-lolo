"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _Inbox = _interopRequireDefault(require("@material-ui/icons/Inbox"));

var _inflection = _interopRequireDefault(require("inflection"));

var _core = require("@material-ui/core");

var _styles = require("@material-ui/core/styles");

var _raCore = require("ra-core");

var _reactAdmin = require("react-admin");

var _ImportButton = _interopRequireDefault(require("./ImportButton"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const useStyles = (0, _styles.makeStyles)(theme => ({
  message: {
    textAlign: 'center',
    opacity: theme.palette.type === 'light' ? 0.5 : 0.8,
    margin: '0 1em',
    color: theme.palette.type === 'light' ? 'inherit' : theme.palette.text.primary
  },
  icon: {
    width: '9em',
    height: '9em'
  },
  toolbar: {
    textAlign: 'center',
    marginTop: '2em'
  }
}), {
  name: 'RaEmpty'
});

const Empty = props => {
  const {
    resource,
    basePath
  } = (0, _raCore.useListContext)(props);
  const classes = useStyles(props);
  const translate = (0, _raCore.useTranslate)();
  const resourceName = translate(`resources.${resource}.forcedCaseName`, {
    smart_count: 0,
    _: _inflection.default.humanize(translate(`resources.${resource}.name`, {
      smart_count: 0,
      _: _inflection.default.pluralize(resource)
    }), true)
  });
  const emptyMessage = translate('ra.page.empty', {
    name: resourceName
  });
  const inviteMessage = translate('ra.page.invite');
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: classes.message
  }, /*#__PURE__*/React.createElement(_Inbox.default, {
    className: classes.icon
  }), /*#__PURE__*/React.createElement(_core.Typography, {
    variant: "h4",
    paragraph: true
  }, translate(`resources.${resource}.empty`, {
    _: emptyMessage
  })), /*#__PURE__*/React.createElement(_core.Typography, {
    variant: "body1"
  }, translate(`resources.${resource}.invite`, {
    _: inviteMessage
  }))), /*#__PURE__*/React.createElement("div", {
    className: classes.toolbar
  }, /*#__PURE__*/React.createElement(_reactAdmin.CreateButton, {
    variant: "contained",
    basePath: basePath
  }), /*#__PURE__*/React.createElement(_ImportButton.default, props)));
};

var _default = Empty;
exports.default = _default;