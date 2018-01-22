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
    responseUrl: PropTypes.string.isRequired,
    afterSubmitUrl: PropTypes.string.isRequired,
    authenticityToken: PropTypes.string.isRequired,
    submitAuthenticityToken: PropTypes.string.isRequired,
    exitButton: PropTypes.shape({
      caption: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
    submitCaption: PropTypes.string,
  };

  static defaultProps = {
    exitButton: null,
    submitCaption: null,
  };

  constructor(props) {
    super(props);

    const {
      conventionUrl,
      formUrl,
      responseUrl,
      afterSubmitUrl,
      authenticityToken,
      submitAuthenticityToken,
    } = this.props;

    this.store = buildReduxStore(
      'FormPresenterApp',
      reducer,
      {
        apiConfiguration: {
          conventionUrl,
          formUrl,
          responseUrl,
          afterSubmitUrl,
          authenticityToken,
          submitAuthenticityToken,
        },
      },
    );
  }

  componentDidMount = () => {
    this.store.dispatch(actions.fetchFormContent());
    this.store.dispatch(actions.fetchConvention());
    this.store.dispatch(actions.fetchResponse());
  }

  render = () => (
    <Provider store={this.store}>
      <FormPresenterContainer
        exitButton={this.props.exitButton}
        submitCaption={this.props.submitCaption}
      />
    </Provider>
  )
}

export default FormPresenterApp;
