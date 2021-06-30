"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authProvider = exports.AuthProvider = void 0;

var _awsAmplify = _interopRequireWildcard(require("aws-amplify"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

_awsAmplify.default.configure({
  Auth: {
    region: 'eu-west-1',
    userPoolId: 'eu-west-1_lQin10bBN',
    userPoolWebClientId: '2j7v5uee5qc13p6kncmlrjqq0q'
  }
});

let authProvider = {
  init: async updateAuth => {
    let token = null;
    token = await (async () => {
      try {
        const session = await _awsAmplify.Auth.currentSession();
        return session.idToken.jwtToken;
      } catch (e) {
        return null;
      }
    })();

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
      updateAuth(event === 'signIn' ? jwtToken : null);
    });

    updateAuth(token);
  },
  login: params => Promise.resolve(),
  logout: params => _awsAmplify.Auth.signOut(),
  checkAuth: params => _awsAmplify.Auth.currentSession(),
  checkError: error => Promise.resolve(),
  getPermissions: params => Promise.resolve()
};
exports.authProvider = authProvider;

class AuthProvider {
  constructor(options) {
    if (options) {
      exports.authProvider = authProvider = Object.assign(authProvider, options);
    }
  }

}

exports.AuthProvider = AuthProvider;