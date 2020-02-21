/* eslint-disable import/first, import/newline-after-import */

import mapValues from 'lodash/mapValues';

import AppRoot from '../AppRoot';
import AppWrapper from '../AppWrapper';
import { lazyWithBundleHashCheck } from '../checkBundleHash';

const LiquidDocs = lazyWithBundleHashCheck(() => import(/* webpackChunkName: "liquid-docs" */ '../LiquidDocs'));

const unwrappedComponents = {
  AppRoot,
  LiquidDocs,
};

const wrappedComponents = mapValues(unwrappedComponents, AppWrapper);

export default wrappedComponents;
export { unwrappedComponents };
