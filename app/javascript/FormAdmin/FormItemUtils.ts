import { v4 as uuidv4 } from 'uuid';
import { DataProxy } from 'apollo-cache';

import {
  FormEditorFormItemFieldsFragment,
  FormEditorFormSectionFieldsFragment,
  FormEditorQueryDocument,
  FormEditorQueryQuery,
} from './queries.generated';
import { FormItemInput } from '../graphqlTypes.generated';

const GENERATED_ID_ARRAY_PROPERTIES = ['choices', 'presets', 'timeblocks', 'omit_timeblocks'] as const;
export type GeneratedIdArrayProperty = typeof GENERATED_ID_ARRAY_PROPERTIES[number];

export type ParsedFormItem<ValueType, PropertiesType> = (
  Omit<FormEditorFormItemFieldsFragment, 'default_value' | 'properties' | 'rendered_properties'> &
  {
    default_value?: ValueType,
    properties: PropertiesType,
    rendered_properties: PropertiesType,
  }
);

export type WithRequiredIdentifier<T extends ParsedFormItem<any, any>> = (
  Omit<T, 'identifier'> & { identifier: NonNullable<T['identifier']> }
);

export type ParsedFormSection = (
  Omit<FormEditorFormSectionFieldsFragment, 'form_items'> &
  { form_items: ParsedFormItem<any, any>[] }
);

export type WithGeneratedId<T> = T & { generatedId: string };

export type WithoutGeneratedId<T> = Omit<T, 'generatedId'>;

export type ArrayWithGeneratedIds<T> = T extends any[] ? WithGeneratedId<T[0]>[] : never;

export type ArrayWithoutGeneratedIds<T> = (
  T extends WithGeneratedId<any>[] ? WithoutGeneratedId<T[0]>[] : never
);

export type PropertiesWithGeneratedIds<T> = {
  [K in keyof T]: K extends GeneratedIdArrayProperty ? ArrayWithGeneratedIds<T[K]> : T[K]
};

export type PropertiesWithoutGeneratedIds<T> = {
  [K in keyof T]: K extends GeneratedIdArrayProperty ? ArrayWithoutGeneratedIds<T[K]> : T[K]
};

export function parseFormItemObject(
  formItem: FormEditorFormItemFieldsFragment,
): ParsedFormItem<any, any> {
  return {
    ...formItem,
    default_value: JSON.parse(formItem.default_value),
    properties: JSON.parse(formItem.properties),
    rendered_properties: JSON.parse(formItem.rendered_properties),
  };
}

export function serializeParsedFormItem(
  formItem: ParsedFormItem<any, any>,
): FormEditorFormItemFieldsFragment {
  return {
    ...formItem,
    default_value: JSON.stringify(formItem.default_value),
    properties: JSON.stringify(formItem.properties),
    rendered_properties: JSON.stringify(formItem.rendered_properties),
  };
}

export function parseFormSectionObject(
  formSection: FormEditorFormSectionFieldsFragment,
): ParsedFormSection {
  return {
    ...formSection,
    form_items: formSection.form_items.map(parseFormItemObject),
  };
}

export function serializeParsedFormSection(
  formSection: ParsedFormSection,
): FormEditorFormSectionFieldsFragment {
  return {
    ...formSection,
    form_items: formSection.form_items.map(serializeParsedFormItem),
  };
}

export function addGeneratedIds<T>(properties: T) {
  return GENERATED_ID_ARRAY_PROPERTIES.reduce((memo, property) => {
    if (memo[property] != null) {
      return {
        ...memo,
        [property]: memo[property].map((item: any) => ({
          ...item,
          generatedId: uuidv4(),
        })),
      };
    }

    return memo;
  }, properties) as PropertiesWithGeneratedIds<T>;
}

export function removeGeneratedIds<T>(properties: T) {
  return GENERATED_ID_ARRAY_PROPERTIES.reduce((memo, property) => {
    if (memo[property] != null) {
      return {
        ...memo,
        [property]: memo[property].map((item: any) => {
          const { generatedId, ...otherItemProperties } = item;
          return otherItemProperties;
        }),
      };
    }

    return memo;
  }, properties) as PropertiesWithoutGeneratedIds<T>;
}

export function buildFormItemInput(formItem: ParsedFormItem<any, any>): FormItemInput {
  return {
    identifier: formItem.identifier,
    item_type: formItem.item_type,
    admin_description: formItem.admin_description,
    public_description: formItem.public_description,
    default_value: formItem.default_value ? JSON.stringify(formItem.default_value) : null,
    properties: JSON.stringify(removeGeneratedIds(formItem.properties)),
  };
}

export function formItemPropertyUpdater<
FormItemType extends ParsedFormItem<any, any>,
PropertyName extends keyof FormItemType['properties']
>(
  property: PropertyName,
  onChange: (
    mutator: (
      prevFormItem: FormItemType
    ) => FormItemType
  ) => void,
) {
  return (newValue: any) => onChange((prevFormItem: FormItemType) => {
    const newFormItem: FormItemType = ({
      ...prevFormItem,
      properties: {
        ...prevFormItem.properties,
        [property]: newValue,
      },
    });
    return newFormItem;
  });
}

export function mutationUpdaterForFormSection<ResultDataType>(
  formId: number,
  formSectionId: number,
  updater: (
    section: FormEditorFormSectionFieldsFragment,
    mutationResultData: ResultDataType,
  ) => void,
) {
  return (proxy: DataProxy, mutationResultData: ResultDataType) => {
    const data = proxy.readQuery<FormEditorQueryQuery>({
      query: FormEditorQueryDocument,
      variables: { id: formId },
    });
    proxy.writeQuery({
      query: FormEditorQueryDocument,
      variables: { id: formId },
      data: {
        ...data,
        form: {
          ...data?.form,
          form_sections: (data?.form?.form_sections ?? []).map((section) => {
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
