import { createActions } from 'redux-actions';
import { createActionThunk } from 'redux-thunk-actions';
import API from '../API';

function createActionThunkWithMeta(type, fn, createMeta) {
  const originalFactory = createActionThunk(type, fn);
  const factory = () => {
    const action = originalFactory();
    action.meta = createMeta();
    return action;
  };

  factory.NAME = originalFactory.NAME;
  factory.START = originalFactory.START;
  factory.SUCCEEDED = originalFactory.SUCCEEDED;
  factory.FAILED = originalFactory.FAILED;
  factory.ENDED = originalFactory.ENDED;

  return factory;
}

const actions = {
  ...createActions({
    PREVIOUS_SECTION: undefined,
    NEXT_SECTION: undefined,
    RESPONSE_VALUE_CHANGED: (field, value) => ({ field, value }),
    SET_AUTHENTICITY_TOKEN: authenticityToken => ({ authenticityToken }),
    SET_CONVENTION_URL: conventionUrl => ({ conventionUrl }),
    SET_FORM_URL: formUrl => ({ formUrl }),
    SET_RESPONSE_URL: responseUrl => ({ responseUrl }),
  }),

  fetchConvention: createActionThunk(
    'FETCH_CONVENTION',
    ({ getState }) => API.fetchConvention(getState().conventionUrl),
  ),
  fetchFormContent: createActionThunk(
    'FETCH_FORM_CONTENT',
    ({ getState }) => API.fetchFormContent(getState().formUrl),
  ),
  fetchResponse: createActionThunk(
    'FETCH_RESPONSE',
    ({ getState }) => API.fetchFormResponse(getState().responseUrl),
  ),
  updateResponse: createActionThunkWithMeta(
    'UPDATE_RESPONSE',
    ({ getState }) => {
      const { responseUrl, response, authenticityToken } = getState();
      return API.updateFormResponse(
        responseUrl,
        response,
        authenticityToken,
      );
    },
    () => ({
      debounce: {
        time: 300,
        key: 'UPDATE_RESPONSE',
      },
    }),
  ),
};

export default actions;
