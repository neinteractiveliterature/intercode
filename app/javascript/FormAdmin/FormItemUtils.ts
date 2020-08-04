import { v4 as uuidv4 } from 'uuid';

import { DataProxy } from 'apollo-cache';
import { FormEditorQuery } from './queries';
import { FormSection, FormItemInput, RegistrationPolicy } from '../graphqlTypes.generated';
import { CommonFormSectionFieldsFragment, CommonFormItemFieldsFragment } from '../Models/commonFormFragments.generated';
import { FormEditorQueryQuery, FormEditorFormItemFieldsFragment } from './queries.generated';
import { TimeblockDefinition, TimeblockOmission, UnparsedTimeblockPreference } from '../FormPresenter/TimeblockTypes';

const GENERATED_ID_ARRAY_PROPERTIES = ['choices', 'presets', 'timeblocks', 'omit_timeblocks'] as const;
export type GeneratedIdArrayProperty = typeof GENERATED_ID_ARRAY_PROPERTIES[number];

export type ParsedFormItem<PropertiesType, ValueType, ItemType = string> = (
  Omit<FormEditorFormItemFieldsFragment, 'default_value' | 'properties' | 'rendered_properties' | 'item_type'> & {
    item_type: ItemType,
    default_value?: ValueType,
    properties?: PropertiesType,
    rendered_properties: PropertiesType,
  }
);

export type FormItemPropertiesType<FormItemType> = (
  FormItemType extends ParsedFormItem<infer PropertiesType, any, any> ? PropertiesType : never
);

export type FormItemValueType<FormItemType> = (
  FormItemType extends ParsedFormItem<any, infer ValueType, any> ? ValueType : never
);

export type WithRequiredIdentifier<T extends ParsedFormItem<any, any>> = (
  Omit<T, 'identifier'> & { identifier: NonNullable<T['identifier']> }
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

export type ParsedFormItemWithGeneratedIds<T extends ParsedFormItem<any, any>> = (
  Omit<T, 'properties' | 'rendered_properties'> & {
    properties?: PropertiesWithGeneratedIds<T['properties']>,
    rendered_properties: PropertiesWithGeneratedIds<T['rendered_properties']>,
  }
);

export type ParsedFormSection<
FormItemType extends ParsedFormItem<any, any> = ParsedFormItem<any, any>
> = (
  Omit<FormSection, 'form_items'> & { form_items: FormItemType[] }
);

type CommonQuestionProperties = {
  identifier: string,
  required?: boolean,
};

export type AgeRestrictionsProperties = CommonQuestionProperties & {
  caption: string,
};

export type AgeRestrictionsValue = {
  age_restrictions_description?: string | null,
  minimum_age?: number | null,
};

export type AgeRestrictionsFormItem = (
  WithRequiredIdentifier<ParsedFormItem<AgeRestrictionsProperties, AgeRestrictionsValue, 'age_restrictions'>>
);

export type DateProperties = CommonQuestionProperties & {
  caption: string,
};

export type DateFormItem = WithRequiredIdentifier<ParsedFormItem<DateProperties, string, 'date'>>;

export type EventEmailProperties = CommonQuestionProperties;

export type EventEmailValue = {
  con_mail_destination?: 'event_email' | 'gms',
  email?: string,
  team_mailing_list_name?: string,
};

export type EventEmailFormItem = WithRequiredIdentifier<ParsedFormItem<EventEmailProperties, EventEmailValue, 'event_email'>>;

export type FreeTextProperties = CommonQuestionProperties & {
  caption: string,
  lines: number,
  free_text_type: 'text' | 'email' | 'number' | 'tel' | 'url' | null,
  format: 'text' | 'markdown',
};

export type FreeTextFormItem = WithRequiredIdentifier<ParsedFormItem<FreeTextProperties, string, 'free_text'>>;

export type MultipleChoiceProperties = CommonQuestionProperties & {
  caption: string,
  style: 'radio_vertical' | 'radio_horizontal' | 'checkbox_vertical' | 'checkbox_horizontal',
  choices: {
    caption: string,
    value: string,
  }[],
  other?: boolean,
  other_caption?: string,
};

export type MultipleChoiceFormItem = WithRequiredIdentifier<ParsedFormItem<MultipleChoiceProperties, string | string[], 'multiple_choice'>>;

export type RegistrationPolicyProperties = CommonQuestionProperties & {
  presets: {
    name: string,
    policy: RegistrationPolicy,
  }[],
  allow_custom: boolean,
};

export type RegistrationPolicyFormItem = (
  WithRequiredIdentifier<ParsedFormItem<RegistrationPolicyProperties, RegistrationPolicy, 'registration_policy'>>
);

export type StaticTextProperties = {
  content: string,
  style: 'normal' | 'subhead',
};

export type StaticTextFormItem = ParsedFormItem<StaticTextProperties, never, 'static_text'>;

export type TimeblockPreferenceProperties = CommonQuestionProperties & {
  caption: string,
  timeblocks: TimeblockDefinition[],
  omit_timeblocks: TimeblockOmission[],
  hide_timestamps?: boolean,
};

export type TimeblockPreferenceFormItem = (
  WithRequiredIdentifier<ParsedFormItem<TimeblockPreferenceProperties, UnparsedTimeblockPreference[], 'timeblock_preference'>>
);

export type TimespanProperties = CommonQuestionProperties & {
  caption: string,
};

export type TimespanFormItem = WithRequiredIdentifier<ParsedFormItem<TimespanProperties, number, 'timespan'>>;

export type TypedFormItem = (
  AgeRestrictionsFormItem |
  DateFormItem |
  EventEmailFormItem |
  FreeTextFormItem |
  MultipleChoiceFormItem |
  RegistrationPolicyFormItem |
  StaticTextFormItem |
  TimeblockPreferenceFormItem |
  TimespanFormItem
);

function formItemFragmentHasProperties(
  fragment: CommonFormItemFieldsFragment,
): fragment is FormEditorFormItemFieldsFragment {
  return Object.prototype.hasOwnProperty.call(fragment, 'properties');
}

export function parseFormItemObject<PropertiesType, ValueType>(
  formItem: CommonFormItemFieldsFragment,
): ParsedFormItem<PropertiesType, ValueType> {
  if (formItemFragmentHasProperties(formItem) && formItem.properties != null) {
    return {
      ...formItem,
      default_value: JSON.parse(formItem.default_value) as ValueType,
      properties: JSON.parse(formItem.properties) as PropertiesType,
      rendered_properties: JSON.parse(formItem.rendered_properties) as PropertiesType,
    };
  }

  return {
    ...formItem,
    default_value: JSON.parse(formItem.default_value) as ValueType,
    rendered_properties: JSON.parse(formItem.rendered_properties) as PropertiesType,
  };
}

export function serializeParsedFormItem<FormItemType extends ParsedFormItem<any, any>>(
  formItem: FormItemType,
): CommonFormItemFieldsFragment {
  if (formItem.properties != null) {
    const serialized: FormEditorFormItemFieldsFragment = {
      ...formItem,
      default_value: JSON.stringify(formItem.default_value),
      properties: JSON.stringify(formItem.properties),
      rendered_properties: JSON.stringify(formItem.rendered_properties),
    };

    return serialized;
  }

  const serialized: CommonFormItemFieldsFragment = {
    ...formItem,
    default_value: JSON.stringify(formItem.default_value),
    rendered_properties: JSON.stringify(formItem.rendered_properties),
  };

  return serialized;
}

export function parseFormSectionObject(formSection: FormSection): ParsedFormSection {
  return {
    ...formSection,
    form_items: formSection.form_items.map(parseFormItemObject),
  };
}

export function serializeParsedFormSection(
  formSection: ParsedFormSection,
): CommonFormSectionFieldsFragment {
  return {
    ...formSection,
    form_items: formSection.form_items.map(serializeParsedFormItem),
  };
}

export function addGeneratedIds<PropertiesType>(properties: PropertiesType) {
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
  }, properties) as PropertiesWithGeneratedIds<PropertiesType>;
}

export function removeGeneratedIds<PropertiesType>(
  properties: PropertiesWithGeneratedIds<PropertiesType>,
) {
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
  }, properties) as PropertiesType;
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
  return (newValue: FormItemType[PropertyName]) => onChange((prevFormItem) => {
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

export function mutationUpdaterForFormSection<ResultDataType>(
  formId: number,
  formSectionId: number,
  updater: (
    section: CommonFormSectionFieldsFragment,
    mutationResultData: ResultDataType,
  ) => void,
) {
  return (proxy: DataProxy, mutationResultData: ResultDataType) => {
    const data = proxy.readQuery<FormEditorQueryQuery>({
      query: FormEditorQuery,
      variables: { id: formId },
    });
    proxy.writeQuery({
      query: FormEditorQuery,
      variables: { id: formId },
      data: {
        ...data,
        form: {
          ...data?.form,
          form_sections: (data?.form.form_sections ?? []).map((section) => {
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
