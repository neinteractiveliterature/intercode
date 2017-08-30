import React from 'react';
import PropTypes from 'prop-types';
import Form from '../../Models/Form';
import FormItem from './FormItem';
import LoadingIndicator from '../../LoadingIndicator';

function getCurrentSection(form, currentSectionId) {
  if (!currentSectionId) {
    return form.getSections().get(0);
  }
  return form.getSection(currentSectionId);
}

function renderProgress(form, section) {
  const items = form.getAllItems();
  const sectionItems = form.getItemsInSection(section.id);
  const itemIndex = items.indexOf(sectionItems.get(0));
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
        {progressPercent}
      </div>
    </div>
  );
}

function renderSection(convention, form, section, response, responseValueChanged, isUpdatingResponse) {
  const items = form.getItemsInSection(section.id).map(item => (
    <FormItem
      key={item.id}
      formItem={item}
      convention={convention}
      value={response[item.identifier]}
      onChange={responseValueChanged}
    />
  ));

  let loadingIndicator = null;
  if (isUpdatingResponse) {
    loadingIndicator = <LoadingIndicator />;
  }

  return (
    <div>
      <div className="card-header">
        <div className="d-flex justify-content-between">
          <h4 className="mb-0">{section.title}</h4>
          {loadingIndicator}
        </div>
      </div>

      {renderProgress(form, section)}

      <div className="card-body">
        {items}
      </div>
    </div>
  );
}

function renderBackButton(currentSectionIndex, onClick) {
  if (currentSectionIndex < 1) {
    return null;
  }

  return (
    <button className="btn btn-secondary" onClick={onClick}>
      <i className="fa fa-chevron-left" /> Back
    </button>
  );
}

function renderContinueButton(currentSectionIndex, sections, onClick, disabled) {
  if (currentSectionIndex >= sections.size - 1) {
    return null;
  }

  return (
    <button className="btn btn-primary" onClick={onClick} disabled={disabled}>
      Continue <i className="fa fa-chevron-right" />
    </button>
  );
}

function renderSubmitButton(currentSectionIndex, sections, onClick, disabled) {
  if (currentSectionIndex < sections.size - 1) {
    return null;
  }

  return (
    <button className="btn btn-primary" onClick={onClick} disabled={disabled}>
      Submit
    </button>
  );
}

const FormPresenter = ({
  convention,
  form,
  currentSectionId,
  previousSection,
  nextSection,
  submitForm,
  response,
  responseValueChanged,
  isUpdatingResponse,
}) => {
  if (!form || !convention || !response) {
    return (
      <div>
        <LoadingIndicator size={4} />
      </div>
    );
  }

  const currentSection = getCurrentSection(form, currentSectionId);
  const sections = form.getSections();
  const currentSectionIndex = sections.indexOf(currentSection);

  const disableContinue = form.getItemsInSection(currentSection.id).some(item => (
    !item.valueIsComplete(response[item.identifier])
  ));

  return (
    <div className="card mb-4">
      {
        renderSection(
          convention,
          form,
          currentSection,
          response,
          responseValueChanged,
          isUpdatingResponse,
        )
      }

      <div className="card-footer d-flex justify-content-between">
        <div>{renderBackButton(currentSectionIndex, previousSection)}</div>
        <div>
          {renderContinueButton(currentSectionIndex, sections, nextSection, disableContinue)}
          {renderSubmitButton(currentSectionIndex, sections, submitForm, isUpdatingResponse)}
        </div>
      </div>
    </div>
  );
};

FormPresenter.propTypes = {
  convention: PropTypes.shape({
    starts_at: PropTypes.string.isRequired,
    ends_at: PropTypes.string.isRequired,
    timezone_name: PropTypes.string.isRequired,
  }),
  form: Form.propType,
  response: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  responseValueChanged: PropTypes.func,
  submitForm: PropTypes.func,
  isUpdatingResponse: PropTypes.bool,
  currentSectionId: PropTypes.number,
  previousSection: PropTypes.func.isRequired,
  nextSection: PropTypes.func.isRequired,
};

export default FormPresenter;
