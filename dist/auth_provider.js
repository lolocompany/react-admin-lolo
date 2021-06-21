"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

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

var _default = {
  login: params => Promise.resolve(),
  logout: params => _awsAmplify.Auth.signOut(),
  checkAuth: params => _awsAmplify.Auth.currentSession(),
  checkError: error => Promise.resolve(),
  getPermissions: params => Promise.resolve()
};
exports.default = _default;