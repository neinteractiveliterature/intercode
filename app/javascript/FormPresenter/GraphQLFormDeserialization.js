import Form from '../Models/Form';

export function deserializeFormResponseModel(model) {
  const { form_response_attrs_json: formResponseAttrsJSON, ...otherAttrs } = model;

  return {
    formResponseAttrs: JSON.parse(formResponseAttrsJSON),
    ...otherAttrs,
  };
}

export function deserializeForm(formData) {
  return Form.fromApiResponse(JSON.parse(formData.form_api_json));
}
