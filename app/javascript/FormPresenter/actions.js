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
    ({ getState }) => {
      const { responseUrl, submitAuthenticityToken, afterSubmitUrl } = getState().apiConfiguration;
      return API.submitFormResponse(responseUrl, submitAuthenticityToken).then(() => {
        window.location.href = afterSubmitUrl;
      });
    },
  ),

  updateResponse: createActionThunkWithMeta(
    'UPDATE_RESPONSE',
    ({ getState }) => {
      const { response, apiConfiguration } = getState();
      const { responseUrl, authenticityToken } = apiConfiguration;

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
