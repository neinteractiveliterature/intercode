import React, { useMemo, useEffect, ReactNode } from 'react';

import useEventCategorySelection from './useEventCategorySelection';
import useEventForm, { EventForm, EventFormProps } from './useEventForm';
import EventCategorySelect, { EventCategorySelectProps } from '../BuiltInFormControls/EventCategorySelect';
import { ConventionForEventCategoryForms } from './getFormForEventCategory';
import { EventCategory } from '../graphqlTypes.generated';
import { FormResponse } from '../FormPresenter/useFormResponse';
import { ConventionForFormItemDisplay } from '../FormPresenter/ItemDisplays/FormItemDisplay';

type EventCategoryForEventFormWithCategorySelection = (
  ConventionForEventCategoryForms['event_categories'][0]
  & Pick<EventCategory, 'scheduling_ui'>
);

type ConventionForEventFormWithCategorySelection = (
  ConventionForFormItemDisplay
  & Omit<ConventionForEventCategoryForms, 'event_categories'>
  & {
    event_categories: EventCategoryForEventFormWithCategorySelection[]
  }
);

export type UseEventFormWithCategorySelectionOptions = {
  convention: ConventionForEventFormWithCategorySelection,
  initialEvent: FormResponse & { event_category?: ({ id: number } | null) },
  schedulingUi?: string | null,
};

export default function useEventFormWithCategorySelection({
  convention, initialEvent, schedulingUi,
}: UseEventFormWithCategorySelectionOptions) {
  const selectableCategoryIds = useMemo(
    () => {
      if (schedulingUi) {
        return convention.event_categories
          .filter((category) => category.scheduling_ui === schedulingUi)
          .map((category) => category.id);
      }

      return convention.event_categories.map((category) => category.id);
    },
    [convention.event_categories, schedulingUi],
  );

  const [selectProps, { eventCategoryId, eventForm, eventCategory }] = useEventCategorySelection({
    convention,
    initialEventCategoryId: initialEvent.event_category?.id,
    selectableCategoryIds,
  });

  const [eventFormProps, { setEvent, ...otherProps }] = useEventForm({
    convention, initialEvent, eventForm,
  });

  useEffect(
    () => {
      setEvent((prevEvent) => ({ ...prevEvent, event_category: eventCategory }));
    },
    [eventCategory, setEvent],
  );

  const eventFormWithCategorySelectionProps = { selectProps, eventFormProps };

  return [eventFormWithCategorySelectionProps, {
    eventCategoryId, eventCategory, ...otherProps,
  }] as const;
}

export type EventFormWithCategorySelectionProps<EventType extends FormResponse> = {
  selectProps: EventCategorySelectProps,
  eventFormProps: EventFormProps<EventType>,
  children?: ReactNode,
};

export function EventFormWithCategorySelection<EventType extends FormResponse>(
  { selectProps, eventFormProps, children }: EventFormWithCategorySelectionProps<EventType>,
) {
  return (
    <>
      <EventCategorySelect {...selectProps} />
      <EventForm {...eventFormProps}>{children}</EventForm>
    </>
  );
}
