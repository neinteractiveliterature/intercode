import React from 'react';
import PropTypes from 'prop-types';
import Form from '../../Models/Form';
import FormSection from './FormSection';
import FormFooter from './FormFooter';
import ItemInteractionTracker from '../ItemInteractionTracker';
import LoadingIndicator from '../../LoadingIndicator';
import SectionTraversalController from '../SectionTraversalController';

class FormPresenter extends React.Component {
  static propTypes = {
    convention: PropTypes.shape({
      starts_at: PropTypes.string.isRequired,
      ends_at: PropTypes.string.isRequired,
      timezone_name: PropTypes.string.isRequired,
    }).isRequired,
    form: Form.propType.isRequired,
    response: PropTypes.shape({}).isRequired,
    responseErrors: PropTypes.shape({}).isRequired,
    responseValuesChanged: PropTypes.func.isRequired,
    isSubmittingResponse: PropTypes.bool.isRequired,
    isUpdatingResponse: PropTypes.bool.isRequired,
    currentSectionId: PropTypes.number,
    currentSection: PropTypes.shape({}).isRequired,
    exitButton: PropTypes.node,
    submitButton: PropTypes.shape({
      caption: PropTypes.string.isRequired,
    }),
    submitForm: PropTypes.func.isRequired,
    currentSectionChanged: PropTypes.func,
    footerContent: PropTypes.node,
  };

  static defaultProps = {
    currentSectionId: null,
    exitButton: null,
    submitButton: null,
    footerContent: null,
    currentSectionChanged: null,
  };

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.currentSectionId !== this.props.currentSectionId) {
      this.scrollToTop();
    }
  }

  scrollToTop = () => {
    if (this.headerDiv) {
      this.headerDiv.scrollIntoView({ behavior: 'smooth' });
    }
  }

  renderProgress = (section) => {
    const { form } = this.props;
    if (form.getSections().length < 2) {
      return null;
    }

    const items = form.getAllItems();
    const sectionItems = form.getItemsInSection(section.id);
    const itemIndex = items.indexOf(sectionItems[sectionItems.length - 1]) + 1;
    const sectionIndex = form.getSections().findIndex(formSection => formSection.id === section.id);
    const progressPercentValue = Math.round((itemIndex / items.length) * 100);
    const progressPercent = `${progressPercentValue}%`;

    return (
      <div className="progress card-img-top" style={{ borderRadius: 0 }}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: progressPercent }}
          aria-valuenow={progressPercentValue}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          Page
          {' '}
          {sectionIndex + 1}
          {' '}
          of
          {' '}
          {form.getSections().length}
        </div>
      </div>
    );
  }

  renderSection = (section) => {
    let loadingIndicator = null;
    if (this.props.isUpdatingResponse || this.props.isSubmittingResponse) {
      loadingIndicator = <LoadingIndicator />;
    }

    return (
      <div>
        <div className="card-header" ref={(element) => { this.headerDiv = element; }}>
          <div className="d-flex justify-content-between">
            <h4 className="mb-0">{section.title}</h4>
            {loadingIndicator}
          </div>
        </div>

        {this.renderProgress(section)}

        <div className="card-body pb-0">
          <FormSection
            ref={
              (component) => { this.section = component ? component.getWrappedInstance() : null; }
            }
            section={section}
            form={this.props.form}
            convention={this.props.convention}
            response={this.props.response}
            errors={this.props.responseErrors}
            responseValuesChanged={this.props.responseValuesChanged}
          />
        </div>
      </div>
    );
  }

  render = () => {
    const {
      form,
      convention,
      response,
      exitButton,
      submitButton,
    } = this.props;
    if (!form || !convention || !response) {
      return (
        <div>
          <LoadingIndicator size={4} />
        </div>
      );
    }

    return (
      <ItemInteractionTracker>
        <div className="card mb-4">
          {this.renderSection(this.props.currentSection)}

          <FormFooter
            form={form}
            response={response}
            exitButton={exitButton}
            submitButton={submitButton}
            submitForm={this.props.submitForm}
            isSubmittingResponse={this.props.isSubmittingResponse}
            currentSectionChanged={this.props.currentSectionChanged}
            scrollToItem={this.section ? this.section.scrollToItem : () => {}}
          >
            {this.props.footerContent}
          </FormFooter>
        </div>
      </ItemInteractionTracker>
    );
  }
}

const FormPresenterTraversalWrapper = WrappedComponent => props => (
  <SectionTraversalController.Traverser>
    {({ currentSectionId, currentSection }) => (
      <WrappedComponent
        currentSectionId={currentSectionId}
        currentSection={currentSection}
        {...props}
      />
    )}
  </SectionTraversalController.Traverser>
);

export default FormPresenterTraversalWrapper(FormPresenter);
export { FormPresenter as PureFormPresenter };
