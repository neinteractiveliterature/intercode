import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

import EventCategorySelect from '../BuiltInFormControls/EventCategorySelect';
import { Transforms } from '../ComposableFormUtils';
import { getFormForEventCategoryId, getProposalFormForEventCategoryId } from './getFormForEventCategory';

export function useEventCategorySelection({
  convention, initialEventCategoryId, selectableCategoryIds,
}) {
  const selectableCategories = useMemo(
    () => (selectableCategoryIds
      ? convention.event_categories.filter(category => selectableCategoryIds.includes(category.id))
      : convention.event_categories),
    [convention.event_categories, selectableCategoryIds],
  );

  const [eventCategoryId, setEventCategoryId] = useState(
    initialEventCategoryId || (
      selectableCategories.length === 1 ? selectableCategories[0].id : null
    ),
  );

  const eventCategorySelectChanged = useCallback(
    e => setEventCategoryId(Transforms.integer(e)),
    [setEventCategoryId],
  );

  const eventForm = useMemo(
    () => getFormForEventCategoryId(eventCategoryId, convention),
    [convention, eventCategoryId],
  );

  const eventProposalForm = useMemo(
    () => getProposalFormForEventCategoryId(eventCategoryId, convention),
    [convention, eventCategoryId],
  );

  const selectProps = {
    eventCategories: selectableCategories,
    value: eventCategoryId,
    onChangeValue: eventCategorySelectChanged,
  };

  return [selectProps, {
    eventCategoryId, setEventCategoryId, eventForm, eventProposalForm,
  }];
}

function EventCategorySelectionWrapper({
  convention, initialEventCategoryId, selectableCategoryIds, children,
}) {
  const [selectProps, { eventCategoryId }] = useEventCategorySelection({
    convention, initialEventCategoryId, selectableCategoryIds,
  });

  return (
    <>
      <EventCategorySelect {...selectProps} />
      {children({ eventCategoryId })}
    </>
  );
}

EventCategorySelectionWrapper.propTypes = {
  convention: PropTypes.shape({
    event_categories: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
    })).isRequired,
  }).isRequired,
  initialEventCategoryId: PropTypes.number,
  selectableCategoryIds: PropTypes.arrayOf(PropTypes.number),
  children: PropTypes.func.isRequired,
};

EventCategorySelectionWrapper.defaultProps = {
  initialEventCategoryId: null,
  selectableCategoryIds: null,
};

export default EventCategorySelectionWrapper;
