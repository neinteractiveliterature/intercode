import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'debounce-promise';
import Form from '../Models/Form';

class FormController extends React.Component {
  static propTypes = {
    form: Form.propType.isRequired,
    convention: PropTypes.shape({}).isRequired,
    response: PropTypes.shape({}).isRequired,
    responseValuesChanged: PropTypes.func.isRequired,
    updateResponse: PropTypes.func.isRequired,
    submitForm: PropTypes.func.isRequired,
    parseResponseErrors: PropTypes.func.isRequired,
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
      responseErrors: {},
      submitPromise: null,
      updatePromise: null,
    };
  }

  responseValuesChanged = (newResponseValues) => {
    const callback = (this.props.autocommit === 'change' ? this.updateFormResponse : null);
    this.props.responseValuesChanged(newResponseValues, callback);
  }

  currentSectionChanged = (currentSectionId, newSectionId) => {
    if (this.props.autocommit === 'nextSection') {
      const currentSectionIndex = this.state.form.getSectionIndex(currentSectionId);
      const newSectionIndex = this.state.form.getSectionIndex(newSectionId);

      if (newSectionIndex > currentSectionIndex) {
        this.updateFormResponse();
      }
    }
  }

  updateFormResponse = debounce(async () => {
    if (this.state.updatePromise) {
      await this.state.updatePromise;
    }

    try {
      const updatePromise = this.props.updateResponse();
      this.setState({ updatePromise });
      await updatePromise;
      this.setState({ updatePromise: null, error: null, responseErrors: {} });
    } catch (error) {
      this.setState({
        updatePromise: null,
        error,
        responseErrors: this.props.parseResponseErrors(error) || {},
      });
    }
  }, 300, { leading: true })

  submitForm = async () => {
    const { updatePromise } = this.state;

    if (updatePromise) {
      updatePromise.then(() => { this.submitForm(); });
      return;
    }

    try {
      if (this.props.autocommit === 'nextSection') {
        await this.updateFormResponse();
      }
      await this.props.submitForm();
      if (this.props.formSubmitted) {
        this.props.formSubmitted();
      }
    } catch (error) {
      this.setState({ error, responseErrors: this.props.parseResponseErrors(error) || {} });
    }
  }

  render = () => {
    const { form, convention, response } = this.props;
    const { responseErrors, error } = this.state;

    return this.props.renderContent({
      form,
      convention,
      response,
      responseErrors,
      error,
      isSubmittingResponse: this.state.submitPromise != null,
      isUpdatingResponse: this.state.updatePromise != null,
      responseValuesChanged: this.responseValuesChanged,
      currentSectionChanged: this.currentSectionChanged,
      submitForm: this.submitForm,
    });
  }
}

export default FormController;
