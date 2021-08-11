"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStores = getStores;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _umi() {
  const data = require("umi");

  _umi = function _umi() {
    return data;
  };

  return data;
}

function _fs() {
  const data = require("fs");

  _fs = function _fs() {
    return data;
  };

  return data;
}

function _path() {
  const data = require("path");

  _path = function _path() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getStores({
  base,
  pattern,
  skipStoreValidate,
  extraStores,
  extraBase
}) {
  return _umi().utils.lodash.uniq(_umi().utils.glob.sync(pattern || '**/*.{ts,tsx,js,jsx}', {
    cwd: base
  }).map(f => (0, _path().join)(base, f)).concat(extraStores || []).concat((extraBase ? _umi().utils.glob.sync(pattern || '**/*.{ts,tsx,js,jsx}', {
    cwd: extraBase
  }) : []).map(f => (0, _path().join)(extraBase, f))).map(_umi().utils.winPath)).filter(f => {
    if (/\.d.ts$/.test(f)) return false;
    if (/\.(test|e2e|spec).(j|t)sx?$/.test(f)) return false; // 允许通过配置下跳过 Store 校验

    if (skipStoreValidate) return true; // TODO: fs cache for performance

    return true;
  });
}