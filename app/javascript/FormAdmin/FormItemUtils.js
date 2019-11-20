import uuidv4 from 'uuid/v4';

import { FormEditorQuery } from './queries.gql';

const GENERATED_ID_ARRAY_PROPERTIES = ['choices', 'presets', 'timeblocks', 'omit_timeblocks'];

export function parseFormItemObject(formItem) {
  return {
    ...formItem,
    default_value: JSON.parse(formItem.default_value),
    properties: JSON.parse(formItem.properties),
    rendered_properties: JSON.parse(formItem.rendered_properties),
  };
}

export function serializeParsedFormItem(formItem) {
  return {
    ...formItem,
    default_value: JSON.stringify(formItem.default_value),
    properties: JSON.stringify(formItem.properties),
    rendered_properties: JSON.stringify(formItem.rendered_properties),
  };
}

export function addGeneratedIds(properties) {
  return GENERATED_ID_ARRAY_PROPERTIES.reduce((memo, property) => {
    if (memo[property] != null) {
      return {
        ...memo,
        [property]: memo[property].map((item) => ({
          ...item,
          generatedId: uuidv4(),
        })),
      };
    }

    return memo;
  }, properties);
}

export function removeGeneratedIds(properties) {
  return GENERATED_ID_ARRAY_PROPERTIES.reduce((memo, property) => {
    if (memo[property] != null) {
      return {
        ...memo,
        [property]: memo[property].map((item) => {
          const { generatedId, ...otherItemProperties } = item;
          return otherItemProperties;
        }),
      };
    }

    return memo;
  }, properties);
}

export function buildFormItemInput(formItem) {
  return {
    identifier: formItem.identifier,
    item_type: formItem.item_type,
    admin_description: formItem.admin_description,
    public_description: formItem.public_description,
    default_value: formItem.default_value ? JSON.stringify(formItem.default_value) : null,
    properties: JSON.stringify(removeGeneratedIds(formItem.properties)),
  };
}

export function formItemPropertyUpdater(property, onChange) {
  return (newValue) => onChange((prevFormItem) => {
    const newFormItem = ({
      ...prevFormItem,
      properties: {
        ...prevFormItem.properties,
        [property]: newValue,
      },
    });
    return newFormItem;
  });
}

export function mutationUpdaterForFormSection(formId, formSectionId, updater) {
  return (proxy, mutationResultData) => {
    const data = proxy.readQuery({ query: FormEditorQuery, variables: { id: formId } });
    proxy.writeQuery({
      query: FormEditorQuery,
      variables: { id: formId },
      data: {
        ...data,
        form: {
          ...data.form,
          form_sections: data.form.form_sections.map((section) => {
            if (section.id !== formSectionId) {
              return section;
            }

            return updater(section, mutationResultData);
          }),
        },
      },
    });
  };
}
