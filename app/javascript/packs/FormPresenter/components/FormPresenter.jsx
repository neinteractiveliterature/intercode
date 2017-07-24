import React from 'react';
import PropTypes from 'prop-types';
import Form from '../../Models/Form';
import FormItem from './FormItem';

function getCurrentSection(form, currentSectionId) {
  if (!currentSectionId) {
    return form.getSections().get(0);
  } else {
    return form.getSection(currentSectionId);
  }
}

function renderProgress(form, section) {
  const sections = form.getSections();
  const sectionIndex = sections.indexOf(section);
  const progressPercentValue = Math.round((sectionIndex / sections.size) * 100);
  const progressPercent = `${progressPercentValue}%`;

  return (
    <div className="progress">
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

function renderSection(form, section) {
  const items = form.getItemsInSection(section.id).map(item => (
    <FormItem key={item.id} formItem={item} />
  ));

  return (
    <section>
      <h2>{section.title}</h2>

      {renderProgress(form, section)}

      {items}
    </section>
  );
}

function renderBackButton(currentSectionIndex, onClick) {
  if (currentSectionIndex < 1) {
    return null;
  }

  return (
    <button className="btn btn-secondary" onClick={onClick}>
      <i className="fa fa-chevron-left"></i> Back
    </button>
  );
}

function renderContinueButton(currentSectionIndex, sections, onClick) {
  if (currentSectionIndex >= sections.size - 1) {
    return null;
  }

  return (
    <button className="btn btn-primary" onClick={onClick}>
      Continue <i className="fa fa-chevron-right"></i>
    </button>
  );
}

const FormPresenter = ({ form, currentSectionId, previousSection, nextSection }) => {
  if (!form) {
    return <div></div>;
  }

  const currentSection = getCurrentSection(form, currentSectionId);
  const sections = form.getSections();
  const currentSectionIndex = sections.indexOf(currentSection);

  return (
    <div>
      {renderSection(form, currentSection)}

      <div className="my-4 d-flex justify-content-between">
        <div>{renderBackButton(currentSectionIndex, previousSection)}</div>
        <div>{renderContinueButton(currentSectionIndex, sections, nextSection)}</div>
      </div>
    </div>
  );
}

FormPresenter.propTypes = {
  form: Form.propType,
  currentSectionId: PropTypes.number,
  previousSection: PropTypes.func.isRequired,
  nextSection: PropTypes.func.isRequired,
};

export default FormPresenter;
