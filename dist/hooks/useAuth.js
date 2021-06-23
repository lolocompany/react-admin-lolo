"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _awsAmplify = require("aws-amplify");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function useAuth() {
  const [jwtToken, setJwtToken] = (0, _react.useState)(null);

  const getCurrentSession = async () => {
    try {
      const session = await _awsAmplify.Auth.currentSession();
      setJwtToken(session.idToken.jwtToken);
    } catch (e) {
      setJwtToken(null);
    }
  };

  (0, _react.useEffect)(() => {
    getCurrentSession();

    _awsAmplify.Hub.listen('auth', data => {
      const {
        payload: {
          event,
          data: {
            signInUserSession: {
              idToken: {
                jwtToken
              }
            }
          }
        }
      } = data;
      setJwtToken(event === 'signIn' ? jwtToken : null);
    });
  }, []);
  return {
    jwtToken
  };
}

var _default = useAuth;
exports.default = _default;