import { EventPageQueryData } from '../EventsApp/EventPage/queries.generated';
import { FormType } from '../graphqlTypes.generated';
import { CommonFormFieldsFragment } from '../Models/commonFormFragments.generated';

const BLANK_FORM: NonNullable<EventPageQueryData['convention']['event']['form']> = {
  __typename: 'Form',
  id: '',
  title: '',
  form_type: FormType.Event,
  form_sections: [],
};

export type EventCategoryFormData = { id: string } & {
  event_form: CommonFormFieldsFragment;
  event_proposal_form?: CommonFormFieldsFragment | null;
};
export type ConventionForEventCategoryForms<EventCategoryType extends EventCategoryFormData> = {
  event_categories: EventCategoryType[];
};

function getFormDataForEventCategoryId<EventCategoryType extends EventCategoryFormData>(
  eventCategoryId: string | undefined | null,
  convention: ConventionForEventCategoryForms<EventCategoryType>,
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

export function getEventFormForEventCategoryId<EventCategoryType extends EventCategoryFormData>(
  eventCategoryId: string | undefined | null,
  convention: ConventionForEventCategoryForms<EventCategoryType>,
): CommonFormFieldsFragment {
  return getFormDataForEventCategoryId(eventCategoryId, convention, (eventCategory) => eventCategory.event_form);
}

export function getProposalFormForEventCategoryId<EventCategoryType extends EventCategoryFormData>(
  eventCategoryId: string | undefined | null,
  convention: ConventionForEventCategoryForms<EventCategoryType>,
): CommonFormFieldsFragment {
  return getFormDataForEventCategoryId(
    eventCategoryId,
    convention,
    (eventCategory) => eventCategory.event_proposal_form,
  );
}
