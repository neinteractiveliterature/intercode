import React, { useContext, SetStateAction } from 'react';
import {
  FormEditorQueryQuery, FormEditorFormSectionFieldsFragment, FormEditorFormItemFieldsFragment,
} from './queries.generated';
import { FormType } from '../graphqlTypes.generated';
import { ParsedFormItem, PropertiesWithGeneratedIds } from './FormItemUtils';

export type FormEditorContextData = {
  convention?: FormEditorQueryQuery['convention'],
  currentSection?: FormEditorFormSectionFieldsFragment,
  form?: FormEditorQueryQuery['form'],
  formType?: FormType,
  renderedFormItemsById: Map<number, FormEditorFormItemFieldsFragment>,
};

export type FormItemWithGeneratedIds<FormItemType extends ParsedFormItem<any, any>> = (
  Omit<FormItemType, 'properties'> & {
    properties: PropertiesWithGeneratedIds<FormItemType['properties']>,
  }
);

export const FormEditorContext = React.createContext<FormEditorContextData>({
  convention: undefined,
  currentSection: undefined,
  form: undefined,
  formType: undefined,
  renderedFormItemsById: new Map(),
});

export type FormEditorStandardItem = {
  description: string,
  required?: boolean,
  item_type?: string,
};

export type FormItemEditorContextData<T extends ParsedFormItem<any, any>> = {
  formItem: FormItemWithGeneratedIds<T>,
  renderedFormItem: FormItemWithGeneratedIds<T>,
  setFormItem: React.Dispatch<SetStateAction<FormItemWithGeneratedIds<T>>>,
  standardItem?: FormEditorStandardItem,
  disabled: boolean,
};

export const FormItemEditorContext = React.createContext<FormItemEditorContextData<any>>({
  formItem: { id: 0, properties: {}, rendered_properties: {} },
  renderedFormItem: { id: 0, properties: {}, rendered_properties: {} },
  setFormItem: () => {},
  standardItem: undefined,
  disabled: false,
});

export function useFormItemEditorContext<T extends ParsedFormItem<any, any>>() {
  return useContext<FormItemEditorContextData<T>>(FormItemEditorContext);
}
