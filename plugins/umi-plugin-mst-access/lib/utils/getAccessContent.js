"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  return `\
import React, { useContext } from 'react';
import AccessContext from './context';

export const useMstAccess = () => {
  const access = useContext(AccessContext);
  return access;
};

export const MstAccess = props => {
  const { accessible, fallback, children } = props;
  if (process.env.NODE_ENV === 'development' && typeof accessible === 'function') {
    console.warn(
      '[plugin-mst-access]: provided "accessible" prop is a function named "' +
        accessible.name +
        '" instead of a boolean, maybe you need check it.',
    );
  }
  return <>{accessible ? children : fallback}</>;
};
`;
}