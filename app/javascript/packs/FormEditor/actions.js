import { createActions } from 'redux-actions';
import { createActionThunk } from 'redux-thunk-actions';
import API from '../API';

const actions = {
  ...createActions({
    SET_BASE_URL: baseUrl => ({ baseUrl }),
  }),

  fetchFormContent: createActionThunk('FETCH_FORM_CONTENT', ({ getState }) => API.fetchFormContent(getState().baseUrl)),
};

export default actions;
