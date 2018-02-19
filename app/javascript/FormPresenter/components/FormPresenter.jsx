import React from 'react';
import PropTypes from 'prop-types';
import Form from '../../Models/Form';
import FormSectionContainer from '../containers/FormSectionContainer';
import FormFooterContainer from '../containers/FormFooterContainer';
import LoadingIndicator from '../../LoadingIndicator';
import { getCurrentSection } from '../FormPresenterUtils';

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
    exitButton: PropTypes.shape({
      caption: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
    submitButton: PropTypes.shape({
      caption: PropTypes.string.isRequired,
    }),
    submitForm: PropTypes.func.isRequired,
    footerContent: PropTypes.node,
  };

  static defaultProps = {
    currentSectionId: null,
    exitButton: null,
    submitButton: null,
    footerContent: null,
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
    if (form.getSections().size < 2) {
      return null;
    }

    const items = form.getAllItems();
    const sectionItems = form.getItemsInSection(section.id);
    const itemIndex = items.indexOf(sectionItems.get(sectionItems.size - 1)) + 1;
    const sectionIndex = form.getSections().findIndex(formSection => formSection.id === section.id);
    const progressPercentValue = Math.round((itemIndex / items.count()) * 100);
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
          Page {sectionIndex + 1} of {form.getSections().size}
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
          <FormSectionContainer
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

    const currentSection = getCurrentSection(form, this.props.currentSectionId);
    const sections = form.getSections();
    const currentSectionIndex = sections.indexOf(currentSection);

    return (
      <div className="card mb-4">
        {this.renderSection(currentSection)}

        <FormFooterContainer
          form={form}
          response={response}
          currentSectionIndex={currentSectionIndex}
          sectionCount={sections.size}
          exitButton={exitButton}
          submitButton={submitButton}
          submitForm={this.props.submitForm}
          isSubmittingResponse={this.props.isSubmittingResponse}
          scrollToItem={this.section ? this.section.scrollToItem : () => {}}
        >
          {this.props.footerContent}
        </FormFooterContainer>
      </div>
    );
  }
}

export default FormPresenter;
