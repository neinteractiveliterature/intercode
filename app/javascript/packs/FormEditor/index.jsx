import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import buildReduxStore from '../buildReduxStore';
import reducer from './reducers';
import actions from './actions';
import FormEditorContainer from './containers/FormEditorContainer';

class FormEditorApp extends React.Component {
  static propTypes = {
    baseUrl: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.store = buildReduxStore(reducer);
    this.store.dispatch(actions.setBaseUrl(this.props.baseUrl));
  }

  componentDidMount = () => {
    this.store.dispatch(actions.fetchFormContent());
  }

  render = () => {
    return (
      <Provider store={this.store}>
        <FormEditorContainer />
      </Provider>
    );
  }
}

export default FormEditorApp;