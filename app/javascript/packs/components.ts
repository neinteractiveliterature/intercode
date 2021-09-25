import mapValues from 'lodash/mapValues';

import AppRoot from '../AppRoot';
import AppWrapper from '../AppWrapper';
import { lazyWithBundleHashCheck } from '../checkBundleHash';

const LiquidDocs = lazyWithBundleHashCheck(
  () => import(/* webpackChunkName: "liquid-docs" */ '../LiquidDocs'),
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const unwrappedComponents: { [name: string]: React.ComponentType<any> } = {
  AppRoot,
  LiquidDocs,
};

const wrappedComponents = mapValues(unwrappedComponents, AppWrapper);

export default wrappedComponents;
export { unwrappedComponents };
