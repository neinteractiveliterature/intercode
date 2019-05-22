import React, { useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';

import useEventCategorySelection from './useEventCategorySelection';
import useEventForm, { EventForm } from './useEventForm';
import EventCategorySelect from '../BuiltInFormControls/EventCategorySelect';

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

  const [selectProps, { eventCategoryId, eventForm, eventCategory }] = useEventCategorySelection({
    convention,
    initialEventCategoryId: ((initialEvent || {}).event_category || {}).id,
    selectableCategoryIds,
  });

  const [eventFormProps, { setEvent, ...otherProps }] = useEventForm({
    convention, initialEvent, eventForm,
  });

  useEffect(
    () => {
      setEvent(prevEvent => ({ ...prevEvent, event_category: eventCategory }));
    },
    [eventCategory, setEvent],
  );

  const eventFormWithCategorySelectionProps = { selectProps, eventFormProps };

  return [eventFormWithCategorySelectionProps, {
    eventCategoryId, eventCategory, eventForm, ...otherProps,
  }];
}

export function EventFormWithCategorySelection({ selectProps, eventFormProps, children }) {
  return (
    <>
      <EventCategorySelect {...selectProps} />
      <EventForm {...eventFormProps}>{children}</EventForm>
    </>
  );
}

EventFormWithCategorySelection.propTypes = {
  selectProps: PropTypes.shape({}).isRequired,
  eventFormProps: PropTypes.shape({}).isRequired,
  children: PropTypes.node,
};

EventFormWithCategorySelection.defaultProps = {
  children: null,
};
