import React from 'react';
import PropTypes from 'prop-types';
import Form from '../../Models/Form';
import { getCurrentSection, getIncompleteItems } from '../FormPresenterUtils';
import ItemInteractionTracker from '../ItemInteractionTracker';
import SectionTraversalController from '../SectionTraversalController';

class FormFooter extends React.Component {
  static propTypes = {
    currentSectionId: PropTypes.number.isRequired,
    currentSectionIndex: PropTypes.number.isRequired,
    sectionCount: PropTypes.number.isRequired,
    previousSection: PropTypes.func.isRequired,
    nextSection: PropTypes.func.isRequired,
    submitForm: PropTypes.func.isRequired,
    currentSectionChanged: PropTypes.func,
    isSubmittingResponse: PropTypes.bool.isRequired,
    exitButton: PropTypes.node,
    submitButton: PropTypes.shape({
      caption: PropTypes.string.isRequired,
    }),
    form: Form.propType.isRequired,
    response: PropTypes.shape({}).isRequired,
    onInteract: PropTypes.func.isRequired,
    scrollToItem: PropTypes.func.isRequired,
    children: PropTypes.node,
  };

  static defaultProps = {
    exitButton: null,
    submitButton: null,
    children: null,
    currentSectionChanged: null,
  };

  validateContinue = () => {
    const { form, currentSectionId, response } = this.props;
    const incompleteItems = getIncompleteItems(form.getItemsInSection(currentSectionId), response);

    if (incompleteItems.length === 0) {
      return true;
    }

    incompleteItems.forEach((item) => {
      if (item.identifier) {
        this.props.onInteract(item.identifier);
      }
    });
    this.props.scrollToItem(incompleteItems[0]);

    return false;
  }

  previousSection = () => {
    this.props.previousSection(this.props.currentSectionChanged);
  }

  tryNextSection = () => {
    if (this.validateContinue()) {
      this.props.nextSection(this.props.currentSectionChanged);
    }
  }

  trySubmitForm = () => {
    if (this.validateContinue()) {
      this.props.submitForm();
    }
  }

  renderBackButton = () => {
    if (this.props.currentSectionIndex < 1) {
      return null;
    }

    return (
      <button className="btn btn-secondary" onClick={this.previousSection}>
        <i className="fa fa-chevron-left" />
        {' '}
Back
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
        onClick={this.tryNextSection}
        type="button"
      >
        Continue
        {' '}
        <i className="fa fa-chevron-right" />
      </button>
    );
  }

  renderSubmitButton = () => {
    if (!this.props.submitButton) {
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
        type="button"
      >
        {this.props.submitButton.caption}
      </button>
    );
  }

  render = () => {
    const backButton = this.renderBackButton();
    const continueButton = this.renderContinueButton();
    const { exitButton } = this.props;
    const submitButton = this.renderSubmitButton();

    if (
      backButton == null
      && continueButton == null
      && exitButton == null
      && submitButton == null
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
        {this.props.children}
      </div>
    );
  }
}

const FormFooterTraversalWrapper = WrappedComponent => props => (
  <SectionTraversalController.Traverser>
    {({
      currentSectionId,
      currentSectionIndex,
      previousSection,
      nextSection,
      sectionCount,
    }) => (
      <WrappedComponent
        currentSectionId={currentSectionId}
        currentSectionIndex={currentSectionIndex}
        previousSection={previousSection}
        nextSection={nextSection}
        sectionCount={sectionCount}
        {...props}
      />
    )}
  </SectionTraversalController.Traverser>
);

const FormFooterInteractionWrapper = WrappedComponent => props => (
  <ItemInteractionTracker.Interactor>
    {({ interactWithItem }) => (
      <WrappedComponent onInteract={interactWithItem} {...props} />
    )}
  </ItemInteractionTracker.Interactor>
);

export default FormFooterTraversalWrapper(FormFooterInteractionWrapper(FormFooter));
export { FormFooter as PureFormFooter };
