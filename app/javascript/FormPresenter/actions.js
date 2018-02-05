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

function createAPIFetchCallback(urlProperty) {
  return ({ getState }) => API.fetchFormResponse(getState().apiConfiguration[urlProperty]);
}

const actions = {
  ...createActions({
    PREVIOUS_SECTION: undefined,
    NEXT_SECTION: undefined,
    RESPONSE_VALUE_CHANGED: (field, value) => ({ field, value }),
    SET_API_CONFIGURATION: apiConfiguration => ({ apiConfiguration }),
    UPDATE_REQUEST_STARTED: promise => ({ promise }),
  }),

  fetchConvention: createActionThunk(
    'FETCH_CONVENTION',
    createAPIFetchCallback('conventionUrl'),
  ),
  fetchFormContent: createActionThunk(
    'FETCH_FORM_CONTENT',
    createAPIFetchCallback('formUrl'),
  ),
  fetchResponse: createActionThunk(
    'FETCH_RESPONSE',
    createAPIFetchCallback('responseUrl'),
  ),

  submitForm: createActionThunk(
    'SUBMIT_FORM',
    ({ getState, dispatch }) => {
      const { updatePromise } = getState();

      if (updatePromise) {
        updatePromise.then(() => { dispatch(actions.submitForm()); });
        return { deferred: true };
      }

      const { responseUrl, submitAuthenticityToken, afterSubmitUrl } = getState().apiConfiguration;
      return API.submitFormResponse(responseUrl, submitAuthenticityToken).then(() => {
        window.location.href = afterSubmitUrl;
      });
    },
  ),

  updateResponse: createActionThunkWithMeta(
    'UPDATE_RESPONSE',
    ({ getState, dispatch }) => {
      const { response, apiConfiguration } = getState();
      const { responseUrl, authenticityToken } = apiConfiguration;

      const promise = API.updateFormResponse(
        responseUrl,
        response,
        authenticityToken,
      );

      dispatch(actions.updateRequestStarted(promise));

      return promise;
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
