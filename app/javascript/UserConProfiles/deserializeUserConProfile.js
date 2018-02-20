export default function deserializeUserConProfile(userConProfile) {
  const { form_response_attrs_json: formResponseAttrsJSON, ...otherAttrs } = userConProfile;

  return {
    formResponseAttrs: JSON.parse(formResponseAttrsJSON),
    ...otherAttrs,
  };
}
