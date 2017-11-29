import React from 'react';
import PropTypes from 'prop-types';
import Form from '../../Models/Form';
import FormItem from './FormItem';
import FormFooterContainer from '../containers/FormFooterContainer';
import LoadingIndicator from '../../LoadingIndicator';

function getCurrentSection(form, currentSectionId) {
  if (!currentSectionId) {
    return form.getSections().get(0);
  }
  return form.getSection(currentSectionId);
}

function renderProgress(form, section) {
  if (form.getSections().size < 2) {
    return null;
  }

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

function renderSection(
  convention,
  form,
  section,
  response,
  responseValueChanged,
  isUpdatingResponse,
) {
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

      <div className="card-body pb-0">
        {items}
      </div>
    </div>
  );
}

const FormPresenter = (props) => {
  const { form, convention, response } = props;
  if (!form || !convention || !response) {
    return (
      <div>
        <LoadingIndicator size={4} />
      </div>
    );
  }

  const currentSection = getCurrentSection(form, props.currentSectionId);
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
          props.responseValueChanged,
          props.isUpdatingResponse,
        )
      }

      <FormFooterContainer
        currentSectionIndex={currentSectionIndex}
        sectionCount={sections.size}
        disableContinue={disableContinue}
      />
    </div>
  );
};

FormPresenter.propTypes = {
  convention: PropTypes.shape({
    starts_at: PropTypes.string.isRequired,
    ends_at: PropTypes.string.isRequired,
    timezone_name: PropTypes.string.isRequired,
  }).isRequired,
  form: Form.propType.isRequired,
  response: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  responseValueChanged: PropTypes.func.isRequired,
  isUpdatingResponse: PropTypes.bool.isRequired,
  currentSectionId: PropTypes.number,
};

FormPresenter.defaultProps = {
  currentSectionId: null,
};

export default FormPresenter;
