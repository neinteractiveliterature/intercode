import AppRoot from '../AppRoot';
import BrowserAppWrapper, { AppWrapperInnerProps } from '../AppWrapper';
import { lazyWithAppEntrypointHeadersCheck } from '../checkAppEntrypointHeadersMatch';

const LiquidDocs = lazyWithAppEntrypointHeadersCheck(
  () => import(/* webpackChunkName: "liquid-docs" */ '../LiquidDocs'),
);

const unwrappedComponents: { [name: string]: React.ComponentType<JSX.IntrinsicAttributes & AppWrapperInnerProps> } = {
  AppRoot,
  LiquidDocs,
};

const wrappedComponents = Object.fromEntries(
  Object.entries(unwrappedComponents).map(([key, value]) => [key, BrowserAppWrapper(value)]),
);

export default wrappedComponents;
export { unwrappedComponents };
