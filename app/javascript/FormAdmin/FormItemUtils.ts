import { v4 as uuidv4 } from 'uuid';
import { ApolloCache } from '@apollo/client';
import { assertNever } from 'assert-never';
import { notEmpty } from '@neinteractiveliterature/litform';

import {
  FormSection,
  FormItemInput,
  RegistrationPolicy,
  FormItemRole,
  FormItem,
  FormItemExposeIn,
} from '../graphqlTypes.generated';
import { CommonFormSectionFieldsFragment, CommonFormItemFieldsFragment } from '../Models/commonFormFragments.generated';
import { FormEditorQueryData, FormEditorFormItemFieldsFragment, FormEditorQueryDocument } from './queries.generated';
import { TimeblockDefinition, TimeblockOmission, UnparsedTimeblockPreference } from '../FormPresenter/TimeblockTypes';
import FormTypes from '../../../config/form_types.json';
import { ArrayWithGeneratedIds, ArrayWithoutGeneratedIds } from '../GeneratedIdUtils';

// In order from lowest to highest rank.  Higher roles always include lower roles
// Must be updated in sync with ROLE_VALUES in form_item.rb
export const FORM_ITEM_ROLES: FormItemRole[] = [
  FormItemRole.Normal,
  FormItemRole.ConfirmedAttendee,
  FormItemRole.TeamMember,
  FormItemRole.AllProfilesBasicAccess,
  FormItemRole.Admin,
];

const GENERATED_ID_ARRAY_PROPERTIES = ['choices', 'presets', 'timeblocks', 'omit_timeblocks'] as const;
export type GeneratedIdArrayProperty = (typeof GENERATED_ID_ARRAY_PROPERTIES)[number];

export type ParsedFormItem<PropertiesType, ValueType, ItemType = string> = Omit<
  FormEditorFormItemFieldsFragment,
  'default_value' | 'properties' | 'rendered_properties' | 'item_type'
> & {
  item_type: ItemType;
  default_value?: ValueType;
  properties?: PropertiesType;
  rendered_properties: PropertiesType;
  visibility: FormItemRole;
  writeability: FormItemRole;
  expose_in?: FormItemExposeIn[] | null;
};

export type FormItemPropertiesType<FormItemType> =
  FormItemType extends ParsedFormItem<infer PropertiesType, unknown, unknown> ? PropertiesType : never;

export type FormItemValueType<FormItemType> =
  FormItemType extends ParsedFormItem<unknown, infer ValueType, unknown> ? ValueType : never;

export type WithRequiredIdentifier<T extends ParsedFormItem<unknown, unknown>> = Omit<T, 'identifier'> & {
  identifier: NonNullable<T['identifier']>;
};

export type PropertiesWithGeneratedIds<T> = T extends undefined
  ? undefined
  : {
      [K in keyof T]: K extends GeneratedIdArrayProperty ? ArrayWithGeneratedIds<T[K], string> : T[K];
    };

export type PropertiesWithoutGeneratedIds<T> = {
  [K in keyof T]: K extends GeneratedIdArrayProperty ? ArrayWithoutGeneratedIds<T[K], string> : T[K];
};

export type WithRequiredProperties<T extends ParsedFormItem<unknown, unknown>> = Omit<T, 'properties'> & {
  properties: NonNullable<T['properties']>;
};

export type ParsedFormItemWithGeneratedIds<T extends ParsedFormItem<unknown, unknown>> = Omit<
  T,
  'properties' | 'rendered_properties'
> & {
  properties: PropertiesWithGeneratedIds<T['properties']>;
  rendered_properties: PropertiesWithGeneratedIds<T['rendered_properties']>;
};

export type ParsedFormSection<
  FormItemType extends ParsedFormItem<unknown, unknown> = ParsedFormItem<unknown, unknown>,
> = Omit<CommonFormSectionFieldsFragment, 'form_items' | 'form' | 'preview_form_item'> & { form_items: FormItemType[] };

export type CommonQuestionProperties = {
  identifier: string;
  required?: boolean;
};

export type AgeRestrictionsProperties = CommonQuestionProperties & {
  caption: string;
};

export type AgeRestrictionsValue = {
  age_restrictions_description?: string | null;
  minimum_age?: number | null;
};

export function valueIsAgeRestrictionsValue(value: unknown): value is AgeRestrictionsValue {
  // AgeRestrictionsValue has no required properties so literally any object will do
  return value != null && typeof value === 'object';
}

export type AgeRestrictionsFormItem = WithRequiredIdentifier<
  ParsedFormItem<AgeRestrictionsProperties, AgeRestrictionsValue, 'age_restrictions'>
>;

export type DateProperties = CommonQuestionProperties & {
  caption: string;
};

export type DateFormItem = WithRequiredIdentifier<ParsedFormItem<DateProperties, string, 'date'>>;

export function valueIsDateItemValue(value: unknown): value is FormItemValueType<DateFormItem> {
  return typeof value === 'string';
}

export type EventEmailProperties = CommonQuestionProperties;

export type EventEmailValue = {
  con_mail_destination?: 'event_email' | 'gms';
  email?: string;
  team_mailing_list_name?: string;
};

export function valueIsEventEmailValue(value: unknown): value is EventEmailValue {
  // EventEmailValue has no required properties so literally any object will do
  return typeof value === 'object' && value != null;
}

export type EventEmailFormItem = WithRequiredIdentifier<
  ParsedFormItem<EventEmailProperties, EventEmailValue, 'event_email'>
>;

export type FreeTextProperties = CommonQuestionProperties & {
  caption: string;
  lines: number;
  free_text_type: 'text' | 'email' | 'number' | 'tel' | 'url' | null;
  format: 'text' | 'markdown';
  advisory_word_limit?: number;
  advisory_character_limit?: number;
};

export type FreeTextFormItem = WithRequiredIdentifier<ParsedFormItem<FreeTextProperties, string, 'free_text'>>;

export function valueIsFreeTextValue(value: unknown): value is FormItemValueType<FreeTextFormItem> {
  return typeof value === 'string';
}

export type MultipleChoiceProperties = CommonQuestionProperties & {
  caption: string;
  style: 'radio_vertical' | 'radio_horizontal' | 'checkbox_vertical' | 'checkbox_horizontal';
  choices: {
    caption: string;
    value: string;
  }[];
  other?: boolean;
  other_caption?: string;
};

export type MultipleChoiceFormItem = WithRequiredIdentifier<
  ParsedFormItem<MultipleChoiceProperties, string | string[], 'multiple_choice'>
>;

export function valueIsMultipleChoiceValue(value: unknown): value is FormItemValueType<MultipleChoiceFormItem> {
  if (typeof value === 'string') {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every((item) => typeof item === 'string');
  }

  return false;
}

export type RegistrationPolicyPreset = {
  name: string;
  policy: RegistrationPolicy;
};

export type RegistrationPolicyProperties = CommonQuestionProperties & {
  presets: RegistrationPolicyPreset[];
  allow_custom: boolean;
};

export type RegistrationPolicyFormItem = WithRequiredIdentifier<
  ParsedFormItem<RegistrationPolicyProperties, RegistrationPolicy, 'registration_policy'>
>;

export function valueIsRegistrationPolicyValue(value: unknown): value is FormItemValueType<RegistrationPolicyFormItem> {
  if (typeof value !== 'object' || value == null) {
    return false;
  }

  return 'buckets' in value && Array.isArray((value as { buckets: unknown }).buckets);
}

export type StaticTextProperties = {
  content: string;
  style: 'normal' | 'subhead';
};

export type StaticTextFormItem = ParsedFormItem<StaticTextProperties, never, 'static_text'>;

export type TimeblockPreferenceProperties = CommonQuestionProperties & {
  caption: string;
  timeblocks: TimeblockDefinition[];
  omit_timeblocks: TimeblockOmission[];
  hide_timestamps?: boolean;
};

export type TimeblockPreferenceFormItem = WithRequiredIdentifier<
  ParsedFormItem<TimeblockPreferenceProperties, UnparsedTimeblockPreference[], 'timeblock_preference'>
>;

export function valueIsTimeblockPreferenceValue(
  value: unknown,
): value is FormItemValueType<TimeblockPreferenceFormItem> {
  if (value == null || !Array.isArray(value)) {
    return false;
  }

  return value.every((preference) =>
    (['start', 'finish', 'label', 'ordinality'] as const).every(
      (field) => Object.prototype.hasOwnProperty.call(preference, field) && typeof preference[field] === 'string',
    ),
  );
}

export type TimespanProperties = CommonQuestionProperties & {
  caption: string;
};

export type TimespanFormItem = WithRequiredIdentifier<ParsedFormItem<TimespanProperties, number, 'timespan'>>;

export function valueIsTimespanValue(value: unknown): value is FormItemValueType<TimespanFormItem> {
  return typeof value === 'number';
}

export type TypedFormItem =
  | AgeRestrictionsFormItem
  | DateFormItem
  | EventEmailFormItem
  | FreeTextFormItem
  | MultipleChoiceFormItem
  | RegistrationPolicyFormItem
  | StaticTextFormItem
  | TimeblockPreferenceFormItem
  | TimespanFormItem;

export function valueIsValidForFormItemType<FormItemType extends TypedFormItem>(
  formItem: FormItemType,
  value: unknown,
): value is FormItemValueType<FormItemType> {
  if (formItem.item_type === 'age_restrictions') {
    return valueIsAgeRestrictionsValue(value);
  } else if (formItem.item_type === 'date') {
    return valueIsDateItemValue(value);
  } else if (formItem.item_type === 'event_email') {
    return valueIsEventEmailValue(value);
  } else if (formItem.item_type === 'free_text') {
    return valueIsFreeTextValue(value);
  } else if (formItem.item_type === 'multiple_choice') {
    return valueIsMultipleChoiceValue(value);
  } else if (formItem.item_type === 'registration_policy') {
    return valueIsRegistrationPolicyValue(value);
  } else if (formItem.item_type === 'static_text') {
    return false;
  } else if (formItem.item_type === 'timeblock_preference') {
    return valueIsTimeblockPreferenceValue(value);
  } else if (formItem.item_type === 'timespan') {
    return valueIsTimespanValue(value);
  } else {
    assertNever(formItem);
  }
}

export function castValueForFormItemType<FormItemType extends TypedFormItem>(
  formItem: FormItemType,
  value: unknown,
): FormItemValueType<FormItemType> | undefined {
  if (valueIsValidForFormItemType(formItem, value)) {
    return value;
  }

  if (formItem.item_type === 'multiple_choice' && typeof value === 'boolean') {
    if (formItem.properties?.style === 'checkbox_horizontal' || formItem.properties?.style === 'checkbox_vertical') {
      return [value.toString()] as FormItemValueType<FormItemType>;
    } else {
      return value.toString() as FormItemValueType<FormItemType>;
    }
  }

  return undefined;
}

function formItemFragmentHasProperties(
  fragment: CommonFormItemFieldsFragment,
): fragment is FormEditorFormItemFieldsFragment {
  return Object.prototype.hasOwnProperty.call(fragment, 'properties');
}

export function parseFormItemObject<PropertiesType, ValueType>(
  formItem: CommonFormItemFieldsFragment,
): ParsedFormItem<PropertiesType, ValueType> {
  const parsedDefaultValue =
    formItem.default_value == null ? undefined : (JSON.parse(formItem.default_value) as ValueType);
  if (formItemFragmentHasProperties(formItem) && formItem.properties != null) {
    return {
      ...formItem,
      default_value: parsedDefaultValue,
      properties: JSON.parse(formItem.properties) as PropertiesType,
      rendered_properties: JSON.parse(formItem.rendered_properties) as PropertiesType,
    };
  }

  return {
    ...formItem,
    default_value: parsedDefaultValue,
    rendered_properties: JSON.parse(formItem.rendered_properties) as PropertiesType,
  };
}

export function parseTypedFormItemObject(formItem: CommonFormItemFieldsFragment): TypedFormItem | undefined {
  const parsedFormItem = parseFormItemObject(formItem);
  const typedFormItem = parsedFormItem as TypedFormItem;

  switch (typedFormItem.item_type) {
    case 'age_restrictions':
    case 'date':
    case 'event_email':
    case 'free_text':
    case 'multiple_choice':
    case 'registration_policy':
    case 'static_text':
    case 'timeblock_preference':
    case 'timespan':
      return typedFormItem;
    default:
      assertNever(typedFormItem, true);
      if (typeof Rollbar !== 'undefined') {
        // @ts-expect-error This is deliberately unreachable, but we want a Rollbar if this happens
        Rollbar.warn(`Form item ${parsedFormItem.id} has unknown type ${formItem.item_type}, ignoring`);
      }
      return undefined;
  }
}

export function parseTypedFormItemArray(formItems: CommonFormItemFieldsFragment[]): TypedFormItem[] {
  return formItems.map(parseTypedFormItemObject).filter(notEmpty);
}

export function parseFormSectionObject(
  formSection: Omit<FormSection, 'id' | 'form_items'> & { id: string; form_items: CommonFormItemFieldsFragment[] },
): ParsedFormSection {
  return {
    ...formSection,
    form_items: formSection.form_items.map(parseFormItemObject),
  };
}

export function addGeneratedIds<PropertiesType>(
  properties: PropertiesType,
): PropertiesWithGeneratedIds<PropertiesType> {
  return GENERATED_ID_ARRAY_PROPERTIES.reduce((memo, property) => {
    const value = memo[property as keyof PropertiesType];
    if (value != null && Array.isArray(value)) {
      return {
        ...memo,
        [property]: value.map((item) => ({
          ...item,
          generatedId: uuidv4(),
        })),
      };
    }

    return memo;
  }, properties) as PropertiesWithGeneratedIds<PropertiesType>;
}

export function removeGeneratedIds<PropertiesType>(
  properties: PropertiesWithGeneratedIds<PropertiesType> | null | undefined,
): PropertiesWithoutGeneratedIds<PropertiesType> | undefined {
  if (properties == null) {
    return undefined;
  }

  return GENERATED_ID_ARRAY_PROPERTIES.reduce((memo, property) => {
    const value = memo[property as keyof PropertiesType];
    if (value != null && Array.isArray(value)) {
      return {
        ...memo,
        [property]: value.map((item) => {
          const { generatedId, ...otherItemProperties } = item;
          return otherItemProperties;
        }),
      };
    }

    return memo;
  }, properties!) as PropertiesWithoutGeneratedIds<PropertiesType>;
}

export function buildFormItemInput<PropertiesType>(
  formItem: ParsedFormItem<PropertiesWithGeneratedIds<PropertiesType>, unknown>,
): FormItemInput {
  return {
    identifier: formItem.identifier,
    item_type: formItem.item_type,
    admin_description: formItem.admin_description,
    public_description: formItem.public_description,
    default_value: formItem.default_value ? JSON.stringify(formItem.default_value) : null,
    properties: JSON.stringify(removeGeneratedIds<PropertiesType>(formItem.properties)),
    visibility: formItem.visibility,
    writeability: formItem.writeability,
    expose_in: formItem.expose_in,
  };
}

export function formItemPropertyUpdater<
  PropertiesType extends Record<string, unknown>,
  FormItemType extends ParsedFormItem<PropertiesType, unknown>,
  PropertyName extends keyof PropertiesType,
>(property: PropertyName, onChange: (mutator: (prevFormItem: FormItemType) => FormItemType) => void) {
  return (newValue: PropertiesType[PropertyName]): void =>
    onChange((prevFormItem) => {
      const newFormItem = {
        ...prevFormItem,
        properties: {
          ...prevFormItem.properties,
          [property]: newValue,
        },
      };
      return newFormItem;
    });
}

export function mutationUpdaterForFormSection<ResultDataType>(
  formId: string,
  formSectionId: string | undefined,
  updater: (
    section: FormEditorQueryData['convention']['form']['form_sections'][number],
    mutationResultData: ResultDataType,
  ) => FormEditorQueryData['convention']['form']['form_sections'][number],
) {
  return (proxy: ApolloCache<unknown>, mutationResultData: ResultDataType): void => {
    if (formSectionId == null) {
      return;
    }
    const data = proxy.readQuery<FormEditorQueryData>({
      query: FormEditorQueryDocument,
      variables: { id: formId },
    });
    if (!data) {
      return;
    }
    proxy.writeQuery<FormEditorQueryData>({
      query: FormEditorQueryDocument,
      variables: { id: formId },
      data: {
        ...data,
        convention: {
          ...data.convention,
          form: {
            ...data.convention.form,
            form_sections: (data.convention.form.form_sections ?? []).map((section) => {
              if (section.id !== formSectionId) {
                return section;
              }

              return updater(section, mutationResultData);
            }),
          },
        },
      },
    });
  };
}

export type FormTypeDefinition =
  | (typeof FormTypes)['event']
  | (typeof FormTypes)['event_proposal']
  | (typeof FormTypes)['user_con_profile'];

export type StandardItemIdentifier<FormType extends FormTypeDefinition> = keyof FormType['standard_items'];

export type AnyStandardItemIdentifier =
  | StandardItemIdentifier<(typeof FormTypes)['event']>
  | StandardItemIdentifier<(typeof FormTypes)['event_proposal']>
  | StandardItemIdentifier<(typeof FormTypes)['user_con_profile']>;

export type StandardItem = Partial<
  Omit<
    FormEditorFormItemFieldsFragment,
    'id' | '__typename' | 'item_type' | 'position' | 'properties' | 'rendered_properties' | 'identifier'
  >
> & {
  identifier: string;
  item_type?: TypedFormItem['item_type'];
  description: string;
  required?: boolean;
  deprecation_reason?: string;
  default_properties?: Record<string, unknown>;
};

export function findStandardItem(formType?: FormTypeDefinition, identifier?: string | null): StandardItem | undefined {
  if (!formType || !identifier) {
    return undefined;
  }

  if (!(identifier in formType.standard_items)) {
    return undefined;
  }

  const standardItem: Omit<StandardItem, 'identifier'> =
    formType.standard_items[identifier as keyof FormTypeDefinition['standard_items']];

  return {
    identifier,
    ...standardItem,
  };
}

export function highestLevelRole(roles: FormItemRole[]): FormItemRole {
  return [...FORM_ITEM_ROLES.reverse()].find((role) => roles.includes(role)) ?? FormItemRole.Normal;
}

export function roleIsAtLeast(a: FormItemRole, b: FormItemRole): boolean {
  return FORM_ITEM_ROLES.indexOf(a) >= FORM_ITEM_ROLES.indexOf(b);
}

export function formItemVisibleTo(formItem: Pick<FormItem, 'visibility'>, role: FormItemRole): boolean {
  return roleIsAtLeast(role, formItem.visibility);
}

export function formItemWriteableBy(
  formItem: Pick<FormItem, 'visibility' | 'writeability'>,
  role: FormItemRole,
): boolean {
  return formItemVisibleTo(formItem, role) && roleIsAtLeast(role, formItem.writeability);
}
