import { v4 as uuidv4 } from 'uuid';
import { ApolloCache } from '@apollo/client';
import { assertNever } from 'assert-never';
import { notEmpty } from '@neinteractiveliterature/litform';

import { FormEditorQuery } from './queries';
import {
  FormSection,
  FormItemInput,
  RegistrationPolicy,
  FormItemRole,
  FormItem,
} from '../graphqlTypes.generated';
import {
  CommonFormSectionFieldsFragment,
  CommonFormItemFieldsFragment,
} from '../Models/commonFormFragments.generated';
import { FormEditorQueryData, FormEditorFormItemFieldsFragment } from './queries.generated';
import {
  TimeblockDefinition,
  TimeblockOmission,
  UnparsedTimeblockPreference,
} from '../FormPresenter/TimeblockTypes';
import FormTypes from '../../../config/form_types.json';
import { ArrayWithGeneratedIds, ArrayWithoutGeneratedIds } from '../GeneratedIdUtils';

// In order from lowest to highest rank.  Higher roles always include lower roles
// Must be updated in sync with ROLE_VALUES in form_item.rb
export const FORM_ITEM_ROLES: FormItemRole[] = [
  FormItemRole.Normal,
  FormItemRole.ConfirmedAttendee,
  FormItemRole.TeamMember,
  FormItemRole.Admin,
];

const GENERATED_ID_ARRAY_PROPERTIES = [
  'choices',
  'presets',
  'timeblocks',
  'omit_timeblocks',
] as const;
export type GeneratedIdArrayProperty = typeof GENERATED_ID_ARRAY_PROPERTIES[number];

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
};

export type FormItemPropertiesType<FormItemType> = FormItemType extends ParsedFormItem<
  infer PropertiesType,
  any,
  any
>
  ? PropertiesType
  : never;

export type FormItemValueType<FormItemType> = FormItemType extends ParsedFormItem<
  any,
  infer ValueType,
  any
>
  ? ValueType
  : never;

export type WithRequiredIdentifier<T extends ParsedFormItem<any, any>> = Omit<T, 'identifier'> & {
  identifier: NonNullable<T['identifier']>;
};

export type PropertiesWithGeneratedIds<T> = T extends undefined
  ? undefined
  : {
      [K in keyof T]: K extends GeneratedIdArrayProperty
        ? ArrayWithGeneratedIds<T[K], string>
        : T[K];
    };

export type PropertiesWithoutGeneratedIds<T> = {
  [K in keyof T]: K extends GeneratedIdArrayProperty
    ? ArrayWithoutGeneratedIds<T[K], string>
    : T[K];
};

export type WithRequiredProperties<T extends ParsedFormItem<any, any>> = Omit<T, 'properties'> & {
  properties: NonNullable<T['properties']>;
};

export type ParsedFormItemWithGeneratedIds<T extends ParsedFormItem<any, any>> = Omit<
  T,
  'properties' | 'rendered_properties'
> & {
  properties: PropertiesWithGeneratedIds<T['properties']>;
  rendered_properties: PropertiesWithGeneratedIds<T['rendered_properties']>;
};

export type ParsedFormSection<
  FormItemType extends ParsedFormItem<any, any> = ParsedFormItem<any, any>,
> = Omit<FormSection, 'form_items' | 'form'> & { form_items: FormItemType[] };

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

export type AgeRestrictionsFormItem = WithRequiredIdentifier<
  ParsedFormItem<AgeRestrictionsProperties, AgeRestrictionsValue, 'age_restrictions'>
>;

export type DateProperties = CommonQuestionProperties & {
  caption: string;
};

export type DateFormItem = WithRequiredIdentifier<ParsedFormItem<DateProperties, string, 'date'>>;

export type EventEmailProperties = CommonQuestionProperties;

export type EventEmailValue = {
  con_mail_destination?: 'event_email' | 'gms';
  email?: string;
  team_mailing_list_name?: string;
};

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

export type FreeTextFormItem = WithRequiredIdentifier<
  ParsedFormItem<FreeTextProperties, string, 'free_text'>
>;

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
  ParsedFormItem<
    TimeblockPreferenceProperties,
    UnparsedTimeblockPreference[],
    'timeblock_preference'
  >
>;

export type TimespanProperties = CommonQuestionProperties & {
  caption: string;
};

export type TimespanFormItem = WithRequiredIdentifier<
  ParsedFormItem<TimespanProperties, number, 'timespan'>
>;

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

export function parseTypedFormItemObject(
  formItem: CommonFormItemFieldsFragment,
): TypedFormItem | undefined {
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
        // @ts-ignore
        Rollbar.warn(
          `Form item ${parsedFormItem.id} has unknown type ${formItem.item_type}, ignoring`,
        );
      }
      return undefined;
  }
}

export function parseTypedFormItemArray(formItems: CommonFormItemFieldsFragment[]) {
  return formItems.map(parseTypedFormItemObject).filter(notEmpty);
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
    const value = memo[property as keyof PropertiesType];
    if (value != null && Array.isArray(value)) {
      return {
        ...memo,
        [property]: (value as any[]).map((item) => ({
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
  if (properties == null) {
    return properties;
  }

  return GENERATED_ID_ARRAY_PROPERTIES.reduce((memo, property) => {
    const value = memo[property as keyof PropertiesType];
    if (value != null && Array.isArray(value)) {
      return {
        ...memo,
        [property]: (value as any[]).map((item) => {
          const { generatedId, ...otherItemProperties } = item;
          return otherItemProperties;
        }),
      };
    }

    return memo;
  }, properties!) as PropertiesType;
}

export function buildFormItemInput(formItem: ParsedFormItem<any, any>): FormItemInput {
  return {
    identifier: formItem.identifier,
    item_type: formItem.item_type,
    admin_description: formItem.admin_description,
    public_description: formItem.public_description,
    default_value: formItem.default_value ? JSON.stringify(formItem.default_value) : null,
    properties: JSON.stringify(removeGeneratedIds(formItem.properties)),
    visibility: formItem.visibility,
    writeability: formItem.writeability,
  };
}

export function formItemPropertyUpdater<
  FormItemType extends ParsedFormItem<any, any>,
  PropertyName extends keyof FormItemType['properties'],
>(
  property: PropertyName,
  onChange: (mutator: (prevFormItem: FormItemType) => FormItemType) => void,
) {
  return (newValue: FormItemType[PropertyName]) =>
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
  formId: number,
  formSectionId: number,
  updater: (section: CommonFormSectionFieldsFragment, mutationResultData: ResultDataType) => void,
) {
  return (proxy: ApolloCache<any>, mutationResultData: ResultDataType) => {
    const data = proxy.readQuery<FormEditorQueryData>({
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

export type FormTypeDefinition =
  | typeof FormTypes['event']
  | typeof FormTypes['event_proposal']
  | typeof FormTypes['user_con_profile'];

export type StandardItemIdentifier<FormType extends FormTypeDefinition> =
  keyof FormType['standard_items'];

export type AnyStandardItemIdentifier =
  | StandardItemIdentifier<typeof FormTypes['event']>
  | StandardItemIdentifier<typeof FormTypes['event_proposal']>
  | StandardItemIdentifier<typeof FormTypes['user_con_profile']>;

export type StandardItem = Partial<
  Omit<
    FormEditorFormItemFieldsFragment,
    | 'id'
    | '__typename'
    | 'item_type'
    | 'position'
    | 'properties'
    | 'rendered_properties'
    | 'identifier'
  >
> & {
  item_type?: TypedFormItem['item_type'];
  description: string;
  required?: boolean;
  deprecation_reason?: string;
  default_properties?: any;
};

export function findStandardItem(
  formType?: FormTypeDefinition,
  identifier?: string | null,
): StandardItem | undefined {
  if (!formType || !identifier) {
    return undefined;
  }

  if (!(identifier in formType.standard_items)) {
    return undefined;
  }

  return formType.standard_items[identifier as keyof FormTypeDefinition['standard_items']];
}

export function highestLevelRole(roles: FormItemRole[]): FormItemRole {
  return [...FORM_ITEM_ROLES.reverse()].find((role) => roles.includes(role)) ?? FormItemRole.Normal;
}

export function roleIsAtLeast(a: FormItemRole, b: FormItemRole): boolean {
  return FORM_ITEM_ROLES.indexOf(a) >= FORM_ITEM_ROLES.indexOf(b);
}

export function formItemVisibleTo(
  formItem: Pick<FormItem, 'visibility'>,
  role: FormItemRole,
): boolean {
  return roleIsAtLeast(role, formItem.visibility);
}

export function formItemWriteableBy(
  formItem: Pick<FormItem, 'visibility' | 'writeability'>,
  role: FormItemRole,
): boolean {
  return formItemVisibleTo(formItem, role) && roleIsAtLeast(role, formItem.writeability);
}
