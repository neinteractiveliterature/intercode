import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware, compose } from 'redux';

const loggerMiddleware = createLogger();

export const defaultMiddleware = [
  loggerMiddleware,
];

export function getComposeEnhancers(name) {
  // eslint-disable-next-line no-underscore-dangle
  if (!window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    return compose;
  }

  // eslint-disable-next-line no-underscore-dangle
  return window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ name }) || compose;
}

export default function buildReduxStore(name, reducer, initialState) {
  const composeEnhancers = getComposeEnhancers(name);

  return createStore(
    reducer,
    initialState,
    composeEnhancers(applyMiddleware(...defaultMiddleware)),
  );
}
