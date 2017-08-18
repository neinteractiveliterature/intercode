import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import createDebounce from 'redux-debounced';
import { createStore, applyMiddleware, compose } from 'redux';

const loggerMiddleware = createLogger();
const debounceMiddleware = createDebounce();

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export default function buildReduxStore(reducer) {
  return createStore(
    reducer,
    composeEnhancers(
      applyMiddleware(
        debounceMiddleware,
        thunkMiddleware,
        loggerMiddleware,
      ),
    ),
  );
}
