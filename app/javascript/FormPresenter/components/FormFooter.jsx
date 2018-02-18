import React from 'react';
import PropTypes from 'prop-types';
import Form from '../../Models/Form';
import { getCurrentSection, getIncompleteItems } from '../FormPresenterUtils';

class FormFooter extends React.Component {
  static propTypes = {
    currentSectionId: PropTypes.number.isRequired,
    currentSectionIndex: PropTypes.number.isRequired,
    sectionCount: PropTypes.number.isRequired,
    previousSection: PropTypes.func.isRequired,
    nextSection: PropTypes.func.isRequired,
    submitForm: PropTypes.func.isRequired,
    isSubmittingResponse: PropTypes.bool.isRequired,
    afterSubmitUrl: PropTypes.string,
    exitButton: PropTypes.shape({
      caption: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
    submitCaption: PropTypes.string,
    form: Form.propType.isRequired,
    response: PropTypes.shape({}).isRequired,
    onInteract: PropTypes.func.isRequired,
    scrollToItem: PropTypes.func.isRequired,
    updateResponse: PropTypes.func.isRequired,
    autosave: PropTypes.oneOf(['change', 'nextSection', 'off']).isRequired,
  };

  static defaultProps = {
    afterSubmitUrl: null,
    exitButton: null,
    submitCaption: 'Submit',
  };

  validateContinue = () => {
    const { form, currentSectionId, response } = this.props;
    const currentSection = getCurrentSection(form, currentSectionId);
    const incompleteItems = getIncompleteItems(form, currentSection, response);

    if (incompleteItems.isEmpty()) {
      return true;
    }

    incompleteItems.forEach((item) => {
      if (item.identifier) {
        this.props.onInteract(item.identifier);
      }
    });
    this.props.scrollToItem(incompleteItems.get(0));

    return false;
  }

  tryNextSection = async () => {
    if (this.validateContinue()) {
      if (this.props.autosave === 'nextSection') {
        await this.props.updateResponse();
      }
      this.props.nextSection();
    }
  }

  trySubmitForm = async () => {
    if (this.validateContinue()) {
      if (this.props.autosave === 'nextSection' || this.props.autosave === 'off') {
        await this.props.updateResponse();
      }
      this.props.submitForm();
    }
  }

  renderBackButton = () => {
    if (this.props.currentSectionIndex < 1) {
      return null;
    }

    this.props.updateResponse();

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
        onClick={this.tryNextSection}
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
        onClick={this.trySubmitForm}
        disabled={this.props.isSubmittingResponse}
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
