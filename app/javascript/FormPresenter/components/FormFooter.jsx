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
    exitButton: PropTypes.shape({
      caption: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
    submitCaption: PropTypes.string,
  };

  static defaultProps = {
    afterSubmitUrl: null,
    exitButton: null,
    submitCaption: 'Submit',
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

  renderExitButton = () => {
    if (this.props.exitButton == null) {
      return null;
    }

    return (
      <a
        className="btn btn-outline-secondary mr-2"
        href={this.props.exitButton.url}
      >
        {this.props.exitButton.caption}
      </a>
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
        className="btn btn-success"
        onClick={this.props.submitForm}
        disabled={this.props.isUpdatingResponse || this.props.disableContinue}
      >
        {this.props.submitCaption || 'Submit'}
      </button>
    );
  }

  render = () => {
    const backButton = this.renderBackButton();
    const continueButton = this.renderContinueButton();
    const exitButton = this.renderExitButton();
    const submitButton = this.renderSubmitButton();

    if (
      backButton == null &&
      continueButton == null &&
      exitButton == null &&
      submitButton == null
    ) {
      return <div />;
    }

    return (
      <div className="card-footer">
        <div className="d-flex justify-content-between">
          <div>{backButton}</div>
          <div>
            {exitButton}
            {continueButton}
            {submitButton}
          </div>
        </div>
        <div className="text-muted text-right">
          <small>Your responses are automatically saved.</small>
        </div>
      </div>
    );
  }
}

export default FormFooter;
