import { createActions } from 'redux-actions';
import { createActionThunk } from 'redux-thunk-actions';
import API from '../API';

const actions = {
  ...createActions({
    PREVIOUS_SECTION: undefined,
    NEXT_SECTION: undefined,
    RESPONSE_VALUE_CHANGED: (field, value) => ({ field, value }),
    SET_CONVENTION_URL: conventionUrl => ({ conventionUrl }),
    SET_FORM_URL: formUrl => ({ formUrl }),
    SET_RESPONSE_URL: responseUrl => ({ responseUrl }),
  }),

  fetchConvention: createActionThunk('FETCH_CONVENTION', ({ getState }) => API.fetchConvention(getState().conventionUrl)),
  fetchFormContent: createActionThunk('FETCH_FORM_CONTENT', ({ getState }) => API.fetchFormContent(getState().formUrl)),
  fetchResponse: createActionThunk('FETCH_RESPONSE', ({ getState }) => API.fetchFormResponse(getState().responseUrl)),
};

export default actions;
