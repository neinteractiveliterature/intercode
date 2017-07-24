import { createActions } from 'redux-actions';
import { createActionThunk } from 'redux-thunk-actions';
import API from '../API';

const actions = {
  ...createActions({
    'PREVIOUS_SECTION': undefined,
    'NEXT_SECTION': undefined,
    'SET_FORM_URL': formUrl => ({ formUrl }),
  }),

  fetchFormContent: createActionThunk('FETCH_FORM_CONTENT', ({ getState }) => API.fetchFormContent(getState().formUrl)),
};

export default actions;