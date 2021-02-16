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
Object.defineProperty(exports, "LoloCreate", {
  enumerable: true,
  get: function () {
    return _Create.default;
  }
});
Object.defineProperty(exports, "LoloEdit", {
  enumerable: true,
  get: function () {
    return _Edit.default;
  }
});
Object.defineProperty(exports, "LoloList", {
  enumerable: true,
  get: function () {
    return _List.default;
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

var _Create = _interopRequireDefault(require("./Create"));

var _Edit = _interopRequireDefault(require("./Edit"));

var _List = _interopRequireDefault(require("./List"));

var _data_provider = _interopRequireDefault(require("./data_provider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }