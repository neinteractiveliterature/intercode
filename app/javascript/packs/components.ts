import AppRoot from '../AppRoot';
import AppWrapper from '../AppWrapper';
import { lazyWithAppEntrypointHeadersCheck } from '../checkAppEntrypointHeadersMatch';

const LiquidDocs = lazyWithAppEntrypointHeadersCheck(
  () => import(/* webpackChunkName: "liquid-docs" */ '../LiquidDocs'),
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const unwrappedComponents: { [name: string]: React.ComponentType<any> } = {
  AppRoot,
  LiquidDocs,
};

const wrappedComponents = Object.fromEntries(
  Object.entries(unwrappedComponents).map(([key, value]) => [key, AppWrapper(value)]),
);

export default wrappedComponents;
export { unwrappedComponents };
