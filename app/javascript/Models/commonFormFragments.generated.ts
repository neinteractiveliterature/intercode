/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
export type CommonFormItemFieldsFragment = { __typename: 'FormItem', position: number, identifier?: string | null | undefined, item_type: string, rendered_properties?: any | null | undefined, default_value?: any | null | undefined, visibility: Types.FormItemRole, writeability: Types.FormItemRole, id: string };

export type CommonFormSectionFieldsFragment = { __typename: 'FormSection', title?: string | null | undefined, position: number, id: string, form_items: Array<{ __typename: 'FormItem', position: number, identifier?: string | null | undefined, item_type: string, rendered_properties?: any | null | undefined, default_value?: any | null | undefined, visibility: Types.FormItemRole, writeability: Types.FormItemRole, id: string }> };

export type CommonFormFieldsFragment = { __typename: 'Form', title: string, form_type: Types.FormType, id: string, form_sections: Array<{ __typename: 'FormSection', title?: string | null | undefined, position: number, id: string, form_items: Array<{ __typename: 'FormItem', position: number, identifier?: string | null | undefined, item_type: string, rendered_properties?: any | null | undefined, default_value?: any | null | undefined, visibility: Types.FormItemRole, writeability: Types.FormItemRole, id: string }> }> };

export const CommonFormItemFieldsFragmentDoc = gql`
    fragment CommonFormItemFields on FormItem {
  id: transitionalId
  position
  identifier
  item_type
  rendered_properties
  default_value
  visibility
  writeability
}
    `;
export const CommonFormSectionFieldsFragmentDoc = gql`
    fragment CommonFormSectionFields on FormSection {
  id: transitionalId
  title
  position
  form_items {
    id: transitionalId
    ...CommonFormItemFields
  }
}
    ${CommonFormItemFieldsFragmentDoc}`;
export const CommonFormFieldsFragmentDoc = gql`
    fragment CommonFormFields on Form {
  id: transitionalId
  title
  form_type
  form_sections {
    id: transitionalId
    ...CommonFormSectionFields
  }
}
    ${CommonFormSectionFieldsFragmentDoc}`;