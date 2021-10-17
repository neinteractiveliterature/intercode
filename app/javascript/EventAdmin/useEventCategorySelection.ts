import { useMemo, useState, useCallback } from 'react';

import {
  getEventFormForEventCategoryId,
  getProposalFormForEventCategoryId,
  ConventionForEventCategoryForms,
  EventCategoryFormData,
} from './getFormForEventCategory';
import { EventCategorySelectProps } from '../BuiltInFormControls/EventCategorySelect';
import { CommonFormFieldsFragment } from '../Models/commonFormFragments.generated';
import { EventCategory } from '../graphqlTypes.generated';

type EventCategorySelectorData = EventCategoryFormData & Pick<EventCategory, 'name'>;
export type UseEventCategorySelectionOptions<EventCategoryType extends EventCategorySelectorData> = {
  convention: ConventionForEventCategoryForms<EventCategoryType>;
  initialEventCategoryId?: string | null;
  selectableCategoryIds?: string[] | null;
};

export type UseEventCategorySelectionResult<EventCategoryType extends EventCategorySelectorData> = readonly [
  EventCategorySelectProps,
  {
    eventCategoryId?: string;
    setEventCategoryId: React.Dispatch<React.SetStateAction<string | undefined>>;
    eventCategory?: EventCategoryType;
    eventForm: CommonFormFieldsFragment;
    eventProposalForm: CommonFormFieldsFragment;
  },
];

export default function useEventCategorySelection<EventCategoryType extends EventCategorySelectorData>({
  convention,
  initialEventCategoryId,
  selectableCategoryIds,
}: UseEventCategorySelectionOptions<EventCategoryType>): UseEventCategorySelectionResult<EventCategoryType> {
  const selectableCategories = useMemo(
    () =>
      selectableCategoryIds
        ? convention.event_categories.filter((category) => selectableCategoryIds.includes(category.id))
        : convention.event_categories,
    [convention.event_categories, selectableCategoryIds],
  );

  const [eventCategoryId, setEventCategoryId] = useState(
    initialEventCategoryId || (selectableCategories.length === 1 ? selectableCategories[0].id : undefined),
  );

  const eventCategory = useMemo(
    () =>
      eventCategoryId ? convention.event_categories.find((category) => category.id === eventCategoryId) : undefined,
    [convention.event_categories, eventCategoryId],
  );

  const eventCategorySelectChanged = useCallback((e) => setEventCategoryId(e ?? undefined), [setEventCategoryId]);

  const eventForm = useMemo(
    () => getEventFormForEventCategoryId(eventCategoryId, convention),
    [convention, eventCategoryId],
  );

  const eventProposalForm = useMemo(
    () => getProposalFormForEventCategoryId(eventCategoryId, convention),
    [convention, eventCategoryId],
  );

  return useMemo(
    () =>
      [
        {
          eventCategories: selectableCategories,
          value: eventCategoryId,
          onValueChange: eventCategorySelectChanged,
        },
        {
          eventCategoryId,
          setEventCategoryId,
          eventCategory,
          eventForm,
          eventProposalForm,
        },
      ] as const,
    [
      selectableCategories,
      eventCategoryId,
      eventCategorySelectChanged,
      setEventCategoryId,
      eventCategory,
      eventForm,
      eventProposalForm,
    ],
  );
}
