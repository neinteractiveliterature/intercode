import { deserializeForm } from '../FormPresenter/GraphQLFormDeserialization';

const BLANK_FORM_API_JSON = JSON.stringify({
  form_sections: [],
  form_items: [],
});

function getFormDataForEventCategoryId(eventCategoryId, convention) {
  if (!eventCategoryId) {
    return { form_api_json: BLANK_FORM_API_JSON };
  }

  const eventCategory = convention.event_categories.find(c => c.id === eventCategoryId);
  if (eventCategory) {
    return eventCategory.event_form;
  }
  return { form_api_json: BLANK_FORM_API_JSON };
}

function getFormDataForEventCategory(event, convention) {
  return getFormDataForEventCategoryId(((event || {}).event_category || {}).id, convention);
}

export default function getFormForEventCategory(event, convention) {
  return deserializeForm(getFormDataForEventCategory(event, convention));
}

export function getFormForEventCategoryId(event, convention) {
  return deserializeForm(getFormDataForEventCategoryId(event, convention));
}
