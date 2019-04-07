import React, { useMemo, useCallback } from 'react';

import { useEventCategorySelection } from './EventCategorySelectionWrapper';
import useEventForm from './useEventForm';

export default function useEventFormWithCategorySelection({
  convention, initialEvent, schedulingUi,
}) {
  const selectableCategoryIds = useMemo(
    () => {
      if (schedulingUi) {
        return convention.event_categories
          .filter(category => category.scheduling_ui === schedulingUi)
          .map(category => category.id);
      }

      return convention.event_categories.map(category => category.id);
    },
    [convention.event_categories, schedulingUi],
  );

  const { renderSelect, eventCategoryId, eventForm } = useEventCategorySelection({
    convention,
    initialEventCategoryId: ((initialEvent || {}).event_category || {}).id,
    selectableCategoryIds,
  });

  const { renderForm: renderInnerForm, ...otherProps } = useEventForm({
    convention, initialEvent, eventForm,
  });

  const renderForm = useCallback(
    () => (
      <>
        {renderSelect()}
        {renderInnerForm()}
      </>
    ),
    [renderSelect, renderInnerForm],
  );

  return {
    renderForm, eventCategoryId, eventForm, ...otherProps,
  };
}
