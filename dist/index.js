"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "LoloAdmin", {
  enumerable: true,
  get: function () {
    return _Admin.Admin;
  }
});
Object.defineProperty(exports, "LoloResource", {
  enumerable: true,
  get: function () {
    return _Resource.Resource;
  }
});
Object.defineProperty(exports, "dataProvider", {
  enumerable: true,
  get: function () {
    return _data_provider.default;
  }
});

var _Admin = require("./Admin");

var _Resource = require("./Resource");

var _data_provider = _interopRequireDefault(require("./data_provider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }