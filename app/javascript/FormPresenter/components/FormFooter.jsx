import React from 'react';
import PropTypes from 'prop-types';

class FormFooter extends React.Component {
  static propTypes = {
    currentSectionIndex: PropTypes.number.isRequired,
    sectionCount: PropTypes.number.isRequired,
    previousSection: PropTypes.func.isRequired,
    nextSection: PropTypes.func.isRequired,
    submitForm: PropTypes.func.isRequired,
    disableContinue: PropTypes.bool.isRequired,
    isUpdatingResponse: PropTypes.bool.isRequired,
    afterSubmitUrl: PropTypes.string,
  };

  static defaultProps = {
    afterSubmitUrl: null,
  };

  renderBackButton = () => {
    if (this.props.currentSectionIndex < 1) {
      return null;
    }

    return (
      <button className="btn btn-secondary" onClick={this.props.previousSection}>
        <i className="fa fa-chevron-left" /> Back
      </button>
    );
  }

  renderContinueButton = () => {
    if (this.props.currentSectionIndex >= this.props.sectionCount - 1) {
      return null;
    }

    return (
      <button
        className="btn btn-primary"
        onClick={this.props.nextSection}
        disabled={this.props.disableContinue}
      >
        Continue <i className="fa fa-chevron-right" />
      </button>
    );
  }

  renderSubmitButton = () => {
    if (this.props.afterSubmitUrl == null) {
      return null;
    }

    if (this.props.currentSectionIndex < this.props.sectionCount - 1) {
      return null;
    }

    return (
      <button
        className="btn btn-primary"
        onClick={this.props.submitForm}
        disabled={this.props.isUpdatingResponse || this.disableContinue}
      >
        Submit
      </button>
    );
  }

  render = () => {
    const backButton = this.renderBackButton();
    const continueButton = this.renderContinueButton();
    const submitButton = this.renderSubmitButton();

    if (backButton == null && continueButton == null && submitButton == null) {
      return <div />;
    }

    return (
      <div className="card-footer d-flex justify-content-between">
        <div>{backButton}</div>
        <div>
          {continueButton}
          {submitButton}
        </div>
      </div>
    );
  }
}

export default FormFooter;
