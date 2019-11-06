export function parseFormItemObject(formItem) {
  return {
    ...formItem,
    default_value: JSON.parse(formItem.default_value),
    properties: JSON.parse(formItem.properties),
    rendered_properties: JSON.parse(formItem.rendered_properties),
  };
}

export function buildFormItemInput(formItem) {
  return {
    identifier: formItem.identifier,
    item_type: formItem.item_type,
    admin_description: formItem.admin_description,
    public_description: formItem.public_description,
    default_value: formItem.default_value ? JSON.stringify(formItem.default_value) : null,
    properties: JSON.stringify(formItem.properties),
  };
}

export function formItemPropertyUpdater(property, onChange) {
  return (newValue) => onChange((prevFormItem) => ({
    ...prevFormItem,
    properties: {
      ...prevFormItem.properties,
      [property]: newValue,
    },
  }));
}
