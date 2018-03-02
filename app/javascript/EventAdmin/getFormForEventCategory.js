import Form from '../Models/Form';

function getFormDataForEventCategory(event, convention) {
  if (event.category === 'volunteer_event') {
    return convention.volunteer_event_form;
  }

  if (event.category === 'filler') {
    return convention.filler_event_form;
  }

  return convention.regular_event_form;
}

export default function getFormForEventCategory(event, convention) {
  const jsonForForm = getFormDataForEventCategory(event, convention).form_api_json;
  return Form.fromApiResponse(JSON.parse(jsonForForm));
}
