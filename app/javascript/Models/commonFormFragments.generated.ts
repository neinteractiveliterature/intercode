/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
export type CommonFormItemFieldsFragment = { __typename: 'FormItem', id: string, position: number, identifier?: string | null, item_type: string, rendered_properties: string, default_value?: string | null, visibility: Types.FormItemRole, writeability: Types.FormItemRole, expose_in?: Array<Types.FormItemExposeIn> | null };

export type CommonFormSectionFieldsFragment = { __typename: 'FormSection', id: string, title?: string | null, position: number, form_items: Array<{ __typename: 'FormItem', id: string, position: number, identifier?: string | null, item_type: string, rendered_properties: string, default_value?: string | null, visibility: Types.FormItemRole, writeability: Types.FormItemRole, expose_in?: Array<Types.FormItemExposeIn> | null }> };

export type CommonFormFieldsFragment = { __typename: 'Form', id: string, title: string, form_type: Types.FormType, form_sections: Array<{ __typename: 'FormSection', id: string, title?: string | null, position: number, form_items: Array<{ __typename: 'FormItem', id: string, position: number, identifier?: string | null, item_type: string, rendered_properties: string, default_value?: string | null, visibility: Types.FormItemRole, writeability: Types.FormItemRole, expose_in?: Array<Types.FormItemExposeIn> | null }> }> };

export const CommonFormItemFieldsFragmentDoc = gql`
    fragment CommonFormItemFields on FormItem {
  id
  position
  identifier
  item_type
  rendered_properties
  default_value
  visibility
  writeability
  expose_in
}
    `;
export const CommonFormSectionFieldsFragmentDoc = gql`
    fragment CommonFormSectionFields on FormSection {
  id
  title
  position
  form_items {
    id
    ...CommonFormItemFields
  }
}
    ${CommonFormItemFieldsFragmentDoc}`;
export const CommonFormFieldsFragmentDoc = gql`
    fragment CommonFormFields on Form {
  id
  title
  form_type
  form_sections {
    id
    ...CommonFormSectionFields
  }
}
    ${CommonFormSectionFieldsFragmentDoc}`;