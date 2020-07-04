/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };


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
  & Pick<Types.FormItem, 'id' | 'position' | 'identifier' | 'item_type' | 'admin_description' | 'public_description' | 'properties' | 'rendered_properties' | 'default_value'>
);

export type FormEditorFormSectionFieldsFragment = (
  { __typename?: 'FormSection' }
  & Pick<Types.FormSection, 'id' | 'title' | 'position'>
  & { form_items: Array<(
    { __typename?: 'FormItem' }
    & Pick<Types.FormItem, 'id'>
    & FormEditorFormItemFieldsFragment
  )> }
);

export type FormEditorDataFragment = (
  { __typename?: 'Form' }
  & Pick<Types.Form, 'id' | 'title' | 'form_type'>
  & { form_sections: Array<(
    { __typename?: 'FormSection' }
    & Pick<Types.FormSection, 'id'>
    & FormEditorFormSectionFieldsFragment
  )> }
);

export type FormAdminQueryQueryVariables = Exact<{ [key: string]: never; }>;


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

export type FormEditorQueryQueryVariables = Exact<{
  id: Types.Scalars['Int'];
}>;


export type FormEditorQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id' | 'name' | 'starts_at' | 'ends_at' | 'timezone_name' | 'timezone_mode' | 'event_mailing_list_domain'>
  )>, form?: Types.Maybe<(
    { __typename?: 'Form' }
    & Pick<Types.Form, 'id'>
    & FormEditorDataFragment
  )> }
);

export type PreviewFormItemQueryQueryVariables = Exact<{
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
  position
  identifier
  item_type
  admin_description
  public_description
  properties
  rendered_properties
  default_value
}
    `;
export const FormEditorFormSectionFieldsFragmentDoc = gql`
    fragment FormEditorFormSectionFields on FormSection {
  id
  title
  position
  form_items {
    id
    ...FormEditorFormItemFields
  }
}
    ${FormEditorFormItemFieldsFragmentDoc}`;
export const FormEditorDataFragmentDoc = gql`
    fragment FormEditorData on Form {
  id
  title
  form_type
  form_sections {
    id
    ...FormEditorFormSectionFields
  }
}
    ${FormEditorFormSectionFieldsFragmentDoc}`;
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
export function useFormAdminQueryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<FormAdminQueryQuery, FormAdminQueryQueryVariables>) {
        return ApolloReactHooks.useQuery<FormAdminQueryQuery, FormAdminQueryQueryVariables>(FormAdminQueryDocument, baseOptions);
      }
export function useFormAdminQueryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<FormAdminQueryQuery, FormAdminQueryQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<FormAdminQueryQuery, FormAdminQueryQueryVariables>(FormAdminQueryDocument, baseOptions);
        }
export type FormAdminQueryQueryHookResult = ReturnType<typeof useFormAdminQueryQuery>;
export type FormAdminQueryLazyQueryHookResult = ReturnType<typeof useFormAdminQueryLazyQuery>;
export type FormAdminQueryQueryResult = ApolloReactCommon.QueryResult<FormAdminQueryQuery, FormAdminQueryQueryVariables>;
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
export function useFormEditorQueryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<FormEditorQueryQuery, FormEditorQueryQueryVariables>) {
        return ApolloReactHooks.useQuery<FormEditorQueryQuery, FormEditorQueryQueryVariables>(FormEditorQueryDocument, baseOptions);
      }
export function useFormEditorQueryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<FormEditorQueryQuery, FormEditorQueryQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<FormEditorQueryQuery, FormEditorQueryQueryVariables>(FormEditorQueryDocument, baseOptions);
        }
export type FormEditorQueryQueryHookResult = ReturnType<typeof useFormEditorQueryQuery>;
export type FormEditorQueryLazyQueryHookResult = ReturnType<typeof useFormEditorQueryLazyQuery>;
export type FormEditorQueryQueryResult = ApolloReactCommon.QueryResult<FormEditorQueryQuery, FormEditorQueryQueryVariables>;
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
export function usePreviewFormItemQueryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<PreviewFormItemQueryQuery, PreviewFormItemQueryQueryVariables>) {
        return ApolloReactHooks.useQuery<PreviewFormItemQueryQuery, PreviewFormItemQueryQueryVariables>(PreviewFormItemQueryDocument, baseOptions);
      }
export function usePreviewFormItemQueryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<PreviewFormItemQueryQuery, PreviewFormItemQueryQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<PreviewFormItemQueryQuery, PreviewFormItemQueryQueryVariables>(PreviewFormItemQueryDocument, baseOptions);
        }
export type PreviewFormItemQueryQueryHookResult = ReturnType<typeof usePreviewFormItemQueryQuery>;
export type PreviewFormItemQueryLazyQueryHookResult = ReturnType<typeof usePreviewFormItemQueryLazyQuery>;
export type PreviewFormItemQueryQueryResult = ApolloReactCommon.QueryResult<PreviewFormItemQueryQuery, PreviewFormItemQueryQueryVariables>;