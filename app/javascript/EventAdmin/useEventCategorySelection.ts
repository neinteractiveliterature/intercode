import { useMemo, useState, useCallback } from 'react';
import { Transforms } from '../ComposableFormUtils';
import {
  getEventFormForEventCategoryId,
  getProposalFormForEventCategoryId,
  ConventionForEventCategoryForms,
  EventCategoryFormData,
} from './getFormForEventCategory';

export type UseEventCategorySelectionOptions<EventCategoryType extends EventCategoryFormData> = {
  convention: ConventionForEventCategoryForms<EventCategoryType>,
  initialEventCategoryId?: number | null,
  selectableCategoryIds?: number[] | null,
};

export default function useEventCategorySelection<EventCategoryType extends EventCategoryFormData>({
  convention, initialEventCategoryId, selectableCategoryIds,
}: UseEventCategorySelectionOptions<EventCategoryType>) {
  const selectableCategories = useMemo(
    () => (selectableCategoryIds
      ? convention.event_categories
        .filter((category) => selectableCategoryIds.includes(category.id))
      : convention.event_categories),
    [convention.event_categories, selectableCategoryIds],
  );

  const [eventCategoryId, setEventCategoryId] = useState(
    initialEventCategoryId || (
      selectableCategories.length === 1 ? selectableCategories[0].id : undefined
    ),
  );

  const eventCategory = useMemo(
    () => (eventCategoryId
      ? convention.event_categories.find((category) => category.id === eventCategoryId)
      : undefined),
    [convention.event_categories, eventCategoryId],
  );

  const eventCategorySelectChanged = useCallback(
    (e) => setEventCategoryId(Transforms.integer(e) ?? undefined),
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
