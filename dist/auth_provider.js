"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _awsAmplify = require("aws-amplify");

_awsAmplify.Auth.configure({
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