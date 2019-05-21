/* eslint-disable import/first, import/newline-after-import */

import { lazy } from 'react';
import mapValues from 'lodash-es/mapValues';

import AppRoot from '../AppRoot';
import AppWrapper from '../AppWrapper';
const LiquidDocs = lazy(() => import(/* webpackChunkName: "liquid-docs" */ '../LiquidDocs'));

const unwrappedComponents = {
  AppRoot,
  LiquidDocs,
};

const wrappedComponents = mapValues(unwrappedComponents, AppWrapper);

export default wrappedComponents;
export { unwrappedComponents };
