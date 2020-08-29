/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { CommonFormItemFieldsFragment, CommonFormFieldsFragment, CommonFormSectionFieldsFragment } from '../Models/commonFormFragments.generated';
import { gql } from '@apollo/client';
import { CommonFormItemFieldsFragmentDoc, CommonFormFieldsFragmentDoc, CommonFormSectionFieldsFragmentDoc } from '../Models/commonFormFragments.generated';
import * as Apollo from '@apollo/client';
export type FormFieldsFragment = (
  { __typename?: 'Form' }
  & Pick<Types.Form, 'id' | 'title' | 'form_type' | 'export_json'>
  & { event_categories: Array<(
    { __typename?: 'EventCategory' }
    & Pick<Types.EventCategory, 'id' | 'name'>
  )>, proposal_event_categories: Array<(
    { __typename?: 'EventCategory' }
    & Pick<Types.EventCategory, 'id' | 'name'>
  )>, user_con_profile_conventions: Array<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id' | 'name'>
  )> }
);

export type FormEditorFormItemFieldsFragment = (
  { __typename?: 'FormItem' }
  & Pick<Types.FormItem, 'id' | 'admin_description' | 'public_description' | 'properties'>
  & CommonFormItemFieldsFragment
);

export type FormEditorDataFragment = (
  { __typename?: 'Form' }
  & Pick<Types.Form, 'id'>
  & { form_sections: Array<(
    { __typename?: 'FormSection' }
    & Pick<Types.FormSection, 'id'>
    & { form_items: Array<(
      { __typename?: 'FormItem' }
      & Pick<Types.FormItem, 'id'>
      & FormEditorFormItemFieldsFragment
    )> }
  )> }
  & CommonFormFieldsFragment
);

export type FormAdminQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type FormAdminQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id' | 'name'>
    & { forms: Array<(
      { __typename?: 'Form' }
      & Pick<Types.Form, 'id'>
      & FormFieldsFragment
    )> }
  )> }
);

export type FormEditorQueryQueryVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type FormEditorQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id' | 'name' | 'starts_at' | 'ends_at' | 'timezone_name' | 'timezone_mode' | 'event_mailing_list_domain'>
  )>, form: (
    { __typename?: 'Form' }
    & Pick<Types.Form, 'id'>
    & FormEditorDataFragment
  ) }
);

export type PreviewFormItemQueryQueryVariables = Types.Exact<{
  formSectionId: Types.Scalars['Int'];
  formItem: Types.FormItemInput;
}>;


export type PreviewFormItemQueryQuery = (
  { __typename?: 'Query' }
  & { previewFormItem: (
    { __typename?: 'FormItem' }
    & Pick<Types.FormItem, 'id'>
    & FormEditorFormItemFieldsFragment
  ) }
);

export const FormFieldsFragmentDoc = gql`
    fragment FormFields on Form {
  id
  title
  form_type
  export_json
  event_categories {
    id
    name
  }
  proposal_event_categories {
    id
    name
  }
  user_con_profile_conventions {
    id
    name
  }
}
    `;
export const FormEditorFormItemFieldsFragmentDoc = gql`
    fragment FormEditorFormItemFields on FormItem {
  id
  admin_description
  public_description
  properties
  ...CommonFormItemFields
}
    ${CommonFormItemFieldsFragmentDoc}`;
export const FormEditorDataFragmentDoc = gql`
    fragment FormEditorData on Form {
  id
  ...CommonFormFields
  form_sections {
    id
    form_items {
      id
      ...FormEditorFormItemFields
    }
  }
}
    ${CommonFormFieldsFragmentDoc}
${FormEditorFormItemFieldsFragmentDoc}`;
export const FormAdminQueryDocument = gql`
    query FormAdminQuery {
  convention {
    id
    name
    forms {
      id
      ...FormFields
    }
  }
}
    ${FormFieldsFragmentDoc}`;

/**
 * __useFormAdminQueryQuery__
 *
 * To run a query within a React component, call `useFormAdminQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useFormAdminQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFormAdminQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useFormAdminQueryQuery(baseOptions?: Apollo.QueryHookOptions<FormAdminQueryQuery, FormAdminQueryQueryVariables>) {
        return Apollo.useQuery<FormAdminQueryQuery, FormAdminQueryQueryVariables>(FormAdminQueryDocument, baseOptions);
      }
export function useFormAdminQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FormAdminQueryQuery, FormAdminQueryQueryVariables>) {
          return Apollo.useLazyQuery<FormAdminQueryQuery, FormAdminQueryQueryVariables>(FormAdminQueryDocument, baseOptions);
        }
export type FormAdminQueryQueryHookResult = ReturnType<typeof useFormAdminQueryQuery>;
export type FormAdminQueryLazyQueryHookResult = ReturnType<typeof useFormAdminQueryLazyQuery>;
export type FormAdminQueryQueryResult = Apollo.QueryResult<FormAdminQueryQuery, FormAdminQueryQueryVariables>;
export const FormEditorQueryDocument = gql`
    query FormEditorQuery($id: Int!) {
  convention {
    id
    name
    starts_at
    ends_at
    timezone_name
    timezone_mode
    event_mailing_list_domain
  }
  form(id: $id) {
    id
    ...FormEditorData
  }
}
    ${FormEditorDataFragmentDoc}`;

/**
 * __useFormEditorQueryQuery__
 *
 * To run a query within a React component, call `useFormEditorQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useFormEditorQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFormEditorQueryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useFormEditorQueryQuery(baseOptions?: Apollo.QueryHookOptions<FormEditorQueryQuery, FormEditorQueryQueryVariables>) {
        return Apollo.useQuery<FormEditorQueryQuery, FormEditorQueryQueryVariables>(FormEditorQueryDocument, baseOptions);
      }
export function useFormEditorQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FormEditorQueryQuery, FormEditorQueryQueryVariables>) {
          return Apollo.useLazyQuery<FormEditorQueryQuery, FormEditorQueryQueryVariables>(FormEditorQueryDocument, baseOptions);
        }
export type FormEditorQueryQueryHookResult = ReturnType<typeof useFormEditorQueryQuery>;
export type FormEditorQueryLazyQueryHookResult = ReturnType<typeof useFormEditorQueryLazyQuery>;
export type FormEditorQueryQueryResult = Apollo.QueryResult<FormEditorQueryQuery, FormEditorQueryQueryVariables>;
export const PreviewFormItemQueryDocument = gql`
    query PreviewFormItemQuery($formSectionId: Int!, $formItem: FormItemInput!) {
  previewFormItem(formSectionId: $formSectionId, formItem: $formItem) {
    id
    ...FormEditorFormItemFields
  }
}
    ${FormEditorFormItemFieldsFragmentDoc}`;

/**
 * __usePreviewFormItemQueryQuery__
 *
 * To run a query within a React component, call `usePreviewFormItemQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `usePreviewFormItemQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePreviewFormItemQueryQuery({
 *   variables: {
 *      formSectionId: // value for 'formSectionId'
 *      formItem: // value for 'formItem'
 *   },
 * });
 */
export function usePreviewFormItemQueryQuery(baseOptions?: Apollo.QueryHookOptions<PreviewFormItemQueryQuery, PreviewFormItemQueryQueryVariables>) {
        return Apollo.useQuery<PreviewFormItemQueryQuery, PreviewFormItemQueryQueryVariables>(PreviewFormItemQueryDocument, baseOptions);
      }
export function usePreviewFormItemQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PreviewFormItemQueryQuery, PreviewFormItemQueryQueryVariables>) {
          return Apollo.useLazyQuery<PreviewFormItemQueryQuery, PreviewFormItemQueryQueryVariables>(PreviewFormItemQueryDocument, baseOptions);
        }
export type PreviewFormItemQueryQueryHookResult = ReturnType<typeof usePreviewFormItemQueryQuery>;
export type PreviewFormItemQueryLazyQueryHookResult = ReturnType<typeof usePreviewFormItemQueryLazyQuery>;
export type PreviewFormItemQueryQueryResult = Apollo.QueryResult<PreviewFormItemQueryQuery, PreviewFormItemQueryQueryVariables>;