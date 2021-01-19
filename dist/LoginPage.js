"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactAdmin = require("react-admin");

var _uiComponents = require("@aws-amplify/ui-components");

var _uiReact = require("@aws-amplify/ui-react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LoginPage = () => {
  const login = (0, _reactAdmin.useLogin)();

  _react.default.useEffect(() => {
    (0, _uiComponents.onAuthUIStateChange)(nextAuthState => {
      if (nextAuthState === _uiComponents.AuthState.SignedIn) {
        login();
      }
    });
  }, []);

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "amplify-form-wrapper"
  }, /*#__PURE__*/_react.default.createElement(_uiReact.AmplifyAuthenticator, null, /*#__PURE__*/_react.default.createElement(_uiReact.AmplifySignIn, {
    slot: "sign-in",
    usernameAlias: "email",
    hideSignUp: true
  })));
};

var _default = LoginPage;
exports.default = _default;