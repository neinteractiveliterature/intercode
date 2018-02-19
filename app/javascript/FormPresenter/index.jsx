import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import buildReduxStore from '../buildReduxStore';
import Form from '../Models/Form';
import reducer from './reducers';

class FormPresenterApp extends React.Component {
  static propTypes = {
    form: Form.propType.isRequired,
    children: PropTypes.node.isRequired,
  };

  constructor(props) {
    super(props);

    this.store = buildReduxStore(
      'FormPresenterApp',
      reducer,
      {
        currentSectionId: props.form.getSections().get(0).id,
      },
    );
  }

  render = () => (
    <Provider store={this.store}>
      {this.props.children}
    </Provider>
  )
}

export default FormPresenterApp;
