import { useMemo, useState, useCallback } from 'react';
import { Transforms } from '../ComposableFormUtils';
import {
  getEventFormForEventCategoryId,
  getProposalFormForEventCategoryId,
  ConventionForEventCategoryForms,
} from './getFormForEventCategory';

export type UseEventCategorySelectionOptions = {
  convention: ConventionForEventCategoryForms,
  initialEventCategoryId?: number | null,
  selectableCategoryIds?: number[] | null,
};

export default function useEventCategorySelection({
  convention, initialEventCategoryId, selectableCategoryIds,
}: UseEventCategorySelectionOptions) {
  const selectableCategories = useMemo(
    () => (selectableCategoryIds
      ? convention.event_categories
        .filter((category) => selectableCategoryIds.includes(category.id))
      : convention.event_categories),
    [convention.event_categories, selectableCategoryIds],
  );

  const [eventCategoryId, setEventCategoryId] = useState(
    initialEventCategoryId || (
      selectableCategories.length === 1 ? selectableCategories[0].id : null
    ),
  );

  const eventCategory = useMemo(
    () => (eventCategoryId
      ? convention.event_categories.find((category) => category.id === eventCategoryId)
      : null),
    [convention.event_categories, eventCategoryId],
  );

  const eventCategorySelectChanged = useCallback(
    (e) => setEventCategoryId(Transforms.integer(e)),
    [setEventCategoryId],
  );

  const eventForm = useMemo(
    () => getEventFormForEventCategoryId(eventCategoryId, convention),
    [convention, eventCategoryId],
  );

  const eventProposalForm = useMemo(
    () => getProposalFormForEventCategoryId(eventCategoryId, convention),
    [convention, eventCategoryId],
  );

  const selectProps = {
    eventCategories: selectableCategories,
    value: eventCategoryId,
    onValueChange: eventCategorySelectChanged,
  };

  return [selectProps, {
    eventCategoryId, setEventCategoryId, eventCategory, eventForm, eventProposalForm,
  }] as const;
}
