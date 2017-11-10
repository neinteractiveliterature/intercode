import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import createDebounce from 'redux-debounced';
import { createStore, applyMiddleware, compose } from 'redux';

const loggerMiddleware = createLogger();
const debounceMiddleware = createDebounce();

export const defaultMiddleware = [
  debounceMiddleware,
  thunkMiddleware,
  loggerMiddleware,
];

export function getComposeEnhancers(name) {
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
