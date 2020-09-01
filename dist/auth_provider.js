"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _awsAmplify = require("aws-amplify");

_awsAmplify.Auth.configure({
  Auth: {
    region: 'eu-west-1',
    userPoolId: 'eu-west-1_QHFROumrL',
    userPoolWebClientId: '2fdpo91r8b6ing6f3558kia6rb'
  }
});

var _default = {
  login: params => Promise.resolve(),
  logout: params => _awsAmplify.Auth.signOut(),
  checkAuth: params => Promise.resolve(),
  checkError: error => Promise.resolve(),
  getPermissions: params => Promise.resolve()
};
exports.default = _default;