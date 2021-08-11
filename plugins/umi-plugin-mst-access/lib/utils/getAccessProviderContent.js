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
import React, { useMemo } from 'react';
import { useMst, useObserver, stores } from 'umi';
import accessFactory from '@/mstAccess';

import AccessContext from './context';

if (typeof useMst !== 'function') {
  throw new Error('[plugin-mst-access]: umi-plugin-mst is needed.')
}
const _routes = require('../core/routes').getRoutes();
console.log('_routes', _routes);

function traverseModifyRoutes(routes, access) {
  const resultRoutes = [].concat(routes);
  const notHandledRoutes = [];
  notHandledRoutes.push(...resultRoutes);
  for (let i = 0; i < notHandledRoutes.length; i++) {
    const currentRoute = notHandledRoutes[i];
    let currentRouteAccessible = typeof currentRoute.unaccessible === 'boolean' ? !currentRoute.unaccessible : true;
    if (currentRoute && currentRoute.mstAccess) {
      if (typeof currentRoute.mstAccess !== 'string') {
        throw new Error('[plugin-mst-access]: "mstAccess" field set in "' + currentRoute.path + '" route should be a string.');
      }
      const accessProp = access[currentRoute.mstAccess];
      if (typeof accessProp === 'function') {
        currentRouteAccessible = accessProp(currentRoute)
      } else if (typeof accessProp === 'boolean') {
        currentRouteAccessible = accessProp;
      }
      currentRoute.unaccessible = !currentRouteAccessible;
    }
    if (currentRoute.routes || currentRoute.childRoutes) {
      const childRoutes = currentRoute.routes || currentRoute.childRoutes;
      if (!Array.isArray(childRoutes)) {
        continue;
      }
      childRoutes.forEach(childRoute => { childRoute.unaccessible = !currentRouteAccessible }); // Default inherit from parent route
      notHandledRoutes.push(...childRoutes);
    }
  }
  return resultRoutes;
}

const AccessProvider = props => {
  const { children } = props;
  const _stores = useObserver(() => stores);
  const access = useMemo(() => accessFactory(_stores), [_stores]);
  if (process.env.NODE_ENV === 'development' && (access === undefined || access === null)) {
    console.warn('[plugin-mst-access]: the access instance created by mstAccess.ts(js) is nullish, maybe you need check it.');
  }
  _routes.splice(0, _routes.length, ...traverseModifyRoutes(_routes, access));
  console.log('routes2', _routes);
  return React.createElement(
    AccessContext.Provider,
    { value: access },
    children,
  );
};
export default AccessProvider;
`;
}