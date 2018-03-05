export default function deserializeUserConProfile(userConProfile) {
  const { form_response_attrs_json: formResponseAttrsJSON, ...otherAttrs } = userConProfile;

  return {
    form_response_attrs: JSON.parse(formResponseAttrsJSON),
    ...otherAttrs,
  };
}
