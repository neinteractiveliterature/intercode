import React, { useContext } from 'react';

import { SectionTraversalContext } from '../SectionTraversalContext';
import Form from '../../Models/Form';

export default function FormProgress({ form }) {
  const { currentSectionId } = useContext(SectionTraversalContext);

  if (form.getSections().length < 2) {
    return null;
  }

  const items = form.getAllItems();
  const sectionItems = form.getItemsInSection(currentSectionId);
  const itemIndex = items.indexOf(sectionItems[sectionItems.length - 1]) + 1;
  const sectionIndex = form.getSections()
    .findIndex((formSection) => formSection.id === currentSectionId);
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

FormProgress.propTypes = {
  form: Form.propType.isRequired,
};
