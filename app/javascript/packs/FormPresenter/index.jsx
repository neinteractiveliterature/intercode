import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import buildReduxStore from '../buildReduxStore';
import reducer from './reducers';
import actions from './actions';
import FormPresenterContainer from './containers/FormPresenterContainer';

class FormPresenterApp extends React.Component {
  static propTypes = {
    formUrl: PropTypes.string.isRequired,
    conventionUrl: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.store = buildReduxStore(reducer);
    this.store.dispatch(actions.setConventionUrl(this.props.conventionUrl));
    this.store.dispatch(actions.setFormUrl(this.props.formUrl));
  }

  componentDidMount = () => {
    this.store.dispatch(actions.fetchFormContent());
    this.store.dispatch(actions.fetchConvention());
  }

  render = () => (
    <Provider store={this.store}>
      <FormPresenterContainer />
    </Provider>
    )
}

export default FormPresenterApp;
