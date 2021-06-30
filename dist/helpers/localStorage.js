"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const customlocalStorage = {
  setItem: (key, value) => {
    let event = new Event('localStorageItemUpdated');
    event.key = key;
    event.value = value;
    localStorage.setItem(key, value);
    window.dispatchEvent(event);
  },
  removeItem: key => {
    let event = new Event('localStorageItemUpdated');
    localStorage.removeItem(key);
    window.dispatchEvent(event);
  },
  getItem: key => {
    return localStorage.getItem(key);
  }
};
var _default = customlocalStorage;
exports.default = _default;