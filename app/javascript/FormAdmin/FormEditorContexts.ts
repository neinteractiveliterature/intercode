import * as React from 'react';
import { FormEditorQueryData } from './queries.generated';
import { FormItemRole, FormType, TimezoneMode } from '../graphqlTypes.generated';
import type {
  AgeRestrictionsFormItem,
  DateFormItem,
  EventEmailFormItem,
  FormTypeDefinition,
  FreeTextFormItem,
  MultipleChoiceFormItem,
  ParsedFormItemWithGeneratedIds,
  RegistrationPolicyFormItem,
  StandardItem,
  StaticTextFormItem,
  TimeblockPreferenceFormItem,
  TimespanFormItem,
  TypedFormItem,
  WithRequiredProperties,
} from './FormItemUtils';
import FormTypes from '../../../config/form_types.json';

export type FormEditorForm = Omit<FormEditorQueryData['convention']['form'], 'form_sections'> & {
  form_sections: (Omit<FormEditorQueryData['convention']['form']['form_sections'][0], 'form_items'> & {
    form_items: TypedFormItem[];
  })[];
};

export type FormEditorFormItem =
  | ParsedFormItemWithGeneratedIds<WithRequiredProperties<AgeRestrictionsFormItem>>
  | ParsedFormItemWithGeneratedIds<WithRequiredProperties<DateFormItem>>
  | ParsedFormItemWithGeneratedIds<WithRequiredProperties<EventEmailFormItem>>
  | ParsedFormItemWithGeneratedIds<WithRequiredProperties<FreeTextFormItem>>
  | ParsedFormItemWithGeneratedIds<WithRequiredProperties<MultipleChoiceFormItem>>
  | ParsedFormItemWithGeneratedIds<WithRequiredProperties<RegistrationPolicyFormItem>>
  | ParsedFormItemWithGeneratedIds<WithRequiredProperties<StaticTextFormItem>>
  | ParsedFormItemWithGeneratedIds<WithRequiredProperties<TimeblockPreferenceFormItem>>
  | ParsedFormItemWithGeneratedIds<WithRequiredProperties<TimespanFormItem>>;

export type FormEditorContextValue = {
  convention: NonNullable<FormEditorQueryData['convention']>;
  currentSection?: FormEditorForm['form_sections'][0];
  form: FormEditorForm;
  formTypeIdentifier: FormType;
  formType: FormTypeDefinition;
  formItemsById: Map<string, TypedFormItem>;
};

export const FormEditorContext = React.createContext<FormEditorContextValue>({
  convention: {
    __typename: 'Convention',
    id: '',
    name: '',
    timezone_mode: TimezoneMode.UserLocal,
    form: {
      __typename: 'Form',
      id: '',
      title: '',
      form_type: FormType.Event,
      form_sections: [],
    },
  },
  currentSection: undefined,
  form: {
    __typename: 'Form',
    id: '',
    title: '',
    form_type: FormType.Event,
    form_sections: [],
  },
  formTypeIdentifier: FormType.Event,
  formType: FormTypes.event,
  formItemsById: new Map(),
});

export type FormItemEditorContextValue = {
  formItem: FormEditorFormItem;
  previewFormItem?: TypedFormItem;
  setFormItem: React.Dispatch<React.SetStateAction<FormEditorFormItem>>;
  standardItem?: StandardItem;
  disabled: boolean;
};

export const FormItemEditorContext = React.createContext<FormItemEditorContextValue>({
  formItem: {
    __typename: 'FormItem',
    id: '',
    position: 1,
    item_type: 'static_text',
    properties: {
      content: '',
      style: 'normal',
    },
    rendered_properties: {
      content: '',
      style: 'normal',
    },
    visibility: FormItemRole.Normal,
    writeability: FormItemRole.Normal,
  },
  previewFormItem: {
    __typename: 'FormItem',
    id: '',
    position: 1,
    item_type: 'static_text',
    rendered_properties: {
      content: '',
      style: 'normal',
    },
    visibility: FormItemRole.Normal,
    writeability: FormItemRole.Normal,
  },
  setFormItem: () => {},
  standardItem: undefined,
  disabled: false,
});
