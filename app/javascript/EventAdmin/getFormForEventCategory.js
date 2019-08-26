import { deserializeForm } from '../FormPresenter/GraphQLFormDeserialization';

const BLANK_FORM_API_JSON = JSON.stringify({
  form_sections: [],
  form_items: [],
});

function getFormDataForEventCategoryId(eventCategoryId, convention, getData) {
  if (!eventCategoryId) {
    return { form_api_json: BLANK_FORM_API_JSON };
  }

  const eventCategory = convention.event_categories.find((c) => c.id === eventCategoryId);
  if (eventCategory) {
    return getData(eventCategory) || { form_api_json: BLANK_FORM_API_JSON };
  }
  return { form_api_json: BLANK_FORM_API_JSON };
}

function getEventFormDataForEventCategoryId(eventCategoryId, convention) {
  return getFormDataForEventCategoryId(
    eventCategoryId,
    convention,
    (eventCategory) => eventCategory.event_form,
  );
}

function getProposalFormDataForEventCategoryId(eventCategoryId, convention) {
  return getFormDataForEventCategoryId(
    eventCategoryId,
    convention,
    (eventCategory) => eventCategory.event_proposal_form,
  );
}

function getFormDataFromEvent(event, convention, getterForEventCategoryId) {
  return getterForEventCategoryId(
    ((event || {}).event_category || {}).id,
    convention,
  );
}

export default function getFormForEventCategory(event, convention) {
  return deserializeForm(getFormDataFromEvent(
    event,
    convention,
    getEventFormDataForEventCategoryId,
  ));
}

export function getProposalFormForEventCategory(event, convention) {
  return deserializeForm(getFormDataFromEvent(
    event,
    convention,
    getProposalFormDataForEventCategoryId,
  ));
}

export function getFormForEventCategoryId(eventCategoryId, convention) {
  return deserializeForm(getEventFormDataForEventCategoryId(eventCategoryId, convention));
}

export function getProposalFormForEventCategoryId(eventCategoryId, convention) {
  return deserializeForm(getProposalFormDataForEventCategoryId(eventCategoryId, convention));
}
