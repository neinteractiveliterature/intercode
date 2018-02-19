import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import API from '../API';
import ErrorDisplay from '../ErrorDisplay';
import LoadingIndicator from '../LoadingIndicator';
import Form from '../Models/Form';

class RESTFormController extends React.Component {
  static propTypes = {
    formUrl: PropTypes.string.isRequired,
    conventionUrl: PropTypes.string.isRequired,
    responseUrl: PropTypes.string.isRequired,
    responseAuthenticityToken: PropTypes.string.isRequired,
    submitAuthenticityToken: PropTypes.string.isRequired,
    renderContent: PropTypes.func.isRequired,
    formSubmitted: PropTypes.func,
    autocommit: PropTypes.oneOf(['change', 'nextSection', 'off']).isRequired,
  };

  static defaultProps = {
    formSubmitted: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      form: null,
      convention: null,
      response: null,
      error: null,
      responseErrors: {},
      submitPromise: null,
      updatePromise: null,
    };
  }

  componentDidMount = () => {
    API.fetchFormContent(this.props.formUrl)
      .then(response => this.setState({ form: Form.fromApiResponse(response.body) }))
      .catch(error => this.setState({ error }));

    API.fetchConvention(this.props.conventionUrl)
      .then(response => this.setState({ convention: response.body }))
      .catch(error => this.setState({ error }));

    API.fetchFormResponse(this.props.responseUrl)
      .then(response => this.setState({ response: response.body }))
      .catch(error => this.setState({ error }));
  }

  responseValuesChanged = (newResponseValues) => {
    const callback = this.props.autocommit === 'change' ? this.updateFormResponse : null;

    this.setState({
      response: {
        ...this.state.response,
        ...newResponseValues,
      },
    }, callback);
  }

  updateFormResponse = debounce(() => {
    const updatePromise = API.updateFormResponse(
      this.props.responseUrl,
      this.state.response,
      this.props.responseAuthenticityToken,
    )
      .then(() => { this.setState({ responseErrors: {}, updatePromise: null }); })
      .catch((error) => { this.setState({ responseErrors: error.response.body.errors }); });

    this.setState({ updatePromise });
  }, 300, { leading: true })

  submitForm = () => {
    const { updatePromise } = this.state;

    if (updatePromise) {
      updatePromise.then(() => { this.submitForm(); });
      return { deferred: true };
    }

    const { responseUrl, submitAuthenticityToken, formSubmitted } = this.props;
    return API.submitFormResponse(responseUrl, submitAuthenticityToken).then(() => {
      if (formSubmitted) {
        formSubmitted();
      }
    }).catch((error) => { this.setState({ responseErrors: error.response.body.errors }); });
  }

  render = () => {
    const {
      form,
      convention,
      response,
      error,
      responseErrors,
    } = this.state;

    if (error) {
      return <ErrorDisplay error={error} />;
    }

    if (!form || !convention || !response) {
      return <LoadingIndicator size={4} />;
    }

    return this.props.renderContent({
      form,
      convention,
      response,
      responseErrors,
      isSubmittingResponse: this.state.submitPromise != null,
      isUpdatingResponse: this.state.updatePromise != null,
      responseValuesChanged: this.responseValuesChanged,
      submitForm: this.submitForm,
    });
  }
}

export default RESTFormController;
