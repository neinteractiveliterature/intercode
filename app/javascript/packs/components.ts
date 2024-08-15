import AppRoot from '../AppRoot';
import AppWrapper from '../AppWrapper';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const unwrappedComponents: { [name: string]: React.ComponentType<any> } = {
  AppRoot,
};

const wrappedComponents = Object.fromEntries(
  Object.entries(unwrappedComponents).map(([key, value]) => [key, AppWrapper(value)]),
);

export default wrappedComponents;
export { unwrappedComponents };
