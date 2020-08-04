import { EventPageQueryQuery } from '../EventsApp/EventPage/queries.generated';
import { FormType, EventCategory } from '../graphqlTypes.generated';
import { CommonFormFieldsFragment } from '../Models/commonFormFragments.generated';

const BLANK_FORM: NonNullable<EventPageQueryQuery['event']['form']> = {
  id: 0,
  title: '',
  form_type: FormType.Event,
  form_sections: [],
};

type EventCategoryFormData = Pick<EventCategory, 'id'> & {
  event_form: CommonFormFieldsFragment,
  event_proposal_form?: CommonFormFieldsFragment,
};
export type ConventionForEventCategoryForms = {
  event_categories: EventCategoryFormData[],
};

function getFormDataForEventCategoryId(
  eventCategoryId: number | undefined | null,
  convention: ConventionForEventCategoryForms,
  getData: (eventCategory: EventCategoryFormData) => CommonFormFieldsFragment | null | undefined,
): CommonFormFieldsFragment {
  if (!eventCategoryId) {
    return BLANK_FORM;
  }

  const eventCategory = convention.event_categories.find((c) => c.id === eventCategoryId);
  if (eventCategory) {
    return getData(eventCategory) ?? BLANK_FORM;
  }
  return BLANK_FORM;
}

export function getEventFormForEventCategoryId(
  eventCategoryId: number | undefined | null,
  convention: ConventionForEventCategoryForms,
) {
  return getFormDataForEventCategoryId(
    eventCategoryId,
    convention,
    (eventCategory) => eventCategory.event_form,
  );
}

export function getProposalFormForEventCategoryId(
  eventCategoryId: number | undefined | null,
  convention: ConventionForEventCategoryForms,
) {
  return getFormDataForEventCategoryId(
    eventCategoryId,
    convention,
    (eventCategory) => eventCategory.event_proposal_form,
  );
}
