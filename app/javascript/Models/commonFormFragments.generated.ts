/* eslint-disable */
import * as Types from '../graphqlTypes.generated';



export type CommonFormItemFieldsFragment = (
  { __typename?: 'FormItem' }
  & Pick<Types.FormItem, 'id' | 'position' | 'identifier' | 'item_type' | 'rendered_properties' | 'default_value'>
);

export type CommonFormSectionFieldsFragment = (
  { __typename?: 'FormSection' }
  & Pick<Types.FormSection, 'id' | 'title' | 'position'>
  & { form_items: Array<(
    { __typename?: 'FormItem' }
    & Pick<Types.FormItem, 'id'>
    & CommonFormItemFieldsFragment
  )> }
);

export type CommonFormFieldsFragment = (
  { __typename?: 'Form' }
  & Pick<Types.Form, 'id' | 'title' | 'form_type'>
  & { form_sections: Array<(
    { __typename?: 'FormSection' }
    & Pick<Types.FormSection, 'id'>
    & CommonFormSectionFieldsFragment
  )> }
);

export const CommonFormItemFieldsFragmentDoc = gql`
    fragment CommonFormItemFields on FormItem {
  id
  position
  identifier
  item_type
  rendered_properties
  default_value
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