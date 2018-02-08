import React from 'react';
import PropTypes from 'prop-types';
import ErrorDisplay from '../../ErrorDisplay';
import Form from '../../Models/Form';
import FormItem from './FormItem';
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
    errors: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    response: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    responseValueChanged: PropTypes.func.isRequired,
    interactedItems: PropTypes.shape({}).isRequired,
    interactedWithItem: PropTypes.func.isRequired,
    isSubmittingResponse: PropTypes.bool.isRequired,
    isUpdatingResponse: PropTypes.bool.isRequired,
    currentSectionId: PropTypes.number,
    exitButton: PropTypes.shape({
      caption: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
    submitCaption: PropTypes.string,
  };

  static defaultProps = {
    currentSectionId: null,
    exitButton: null,
    submitCaption: null,
  };

  constructor(props) {
    super(props);
    this.itemRefs = {};
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.currentSectionId !== this.props.currentSectionId) {
      this.scrollToTop();
      this.itemRefs = {};
    }
  }

  scrollToTop = () => {
    if (this.headerDiv) {
      this.headerDiv.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToItem = (item) => {
    const itemRef = this.itemRefs[item.identifier];
    if (itemRef) {
      itemRef.scrollIntoView({ behavior: 'smooth' });
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
    const {
      convention,
      form,
      interactedWithItem,
      interactedItems,
      response,
      responseValueChanged,
      isSubmittingResponse,
      isUpdatingResponse,
      errors,
    } = this.props;

    const items = form.getItemsInSection(section.id).map((item) => {
      const itemErrors = errors[item.identifier] || [];
      const errorsForDisplay = (itemErrors.length > 0 ? itemErrors.join(', ') : null);

      return (
        <div ref={(component) => { this.itemRefs[item.identifier] = component; }}>
          <FormItem
            key={item.id}
            formItem={item}
            convention={convention}
            valueInvalid={
              item.identifier &&
              interactedItems[item.identifier] &&
              !item.valueIsComplete(response[item.identifier])
            }
            value={response[item.identifier]}
            onChange={responseValueChanged}
            onInteract={interactedWithItem}
          />
          <ErrorDisplay stringError={errorsForDisplay} />
        </div>
      );
    });

    let loadingIndicator = null;
    if (isUpdatingResponse || isSubmittingResponse) {
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
          {items}
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
      submitCaption,
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
          currentSectionIndex={currentSectionIndex}
          sectionCount={sections.size}
          exitButton={exitButton}
          submitCaption={submitCaption}
          scrollToItem={this.scrollToItem}
        />
      </div>
    );
  }
}

export default FormPresenter;
