"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const event = new Event('localStorageItemUpdated');
const customlocalStorage = {
  setItem: (key, value) => {
    event.key = key;
    event.value = value;
    localStorage.setItem(key, value);
    window.dispatchEvent(event);
  },
  removeItem: key => {
    localStorage.removeItem(key);
    window.dispatchEvent(event);
  },
  getItem: key => {
    return localStorage.getItem(key);
  }
};
var _default = customlocalStorage;
exports.default = _default;