/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { CommonFormItemFieldsFragmentDoc } from '../Models/commonFormFragments.generated';
import { CommonFormFieldsFragmentDoc, CommonFormSectionFieldsFragmentDoc } from '../Models/commonFormFragments.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type FormFieldsFragment = { __typename: 'Form', id: number, title: string, form_type: Types.FormType, export_json: any, event_categories: Array<{ __typename: 'EventCategory', id: number, name: string }>, proposal_event_categories: Array<{ __typename: 'EventCategory', id: number, name: string }>, user_con_profile_conventions: Array<{ __typename: 'Convention', id: number, name: string }> };

export type FormEditorFormItemFieldsFragment = { __typename: 'FormItem', id: number, admin_description?: Types.Maybe<string>, public_description?: Types.Maybe<string>, properties?: Types.Maybe<any>, position: number, identifier?: Types.Maybe<string>, item_type: string, rendered_properties?: Types.Maybe<any>, default_value?: Types.Maybe<any>, visibility: Types.FormItemRole, writeability: Types.FormItemRole };

export type FormEditorDataFragment = { __typename: 'Form', id: number, title: string, form_type: Types.FormType, form_sections: Array<{ __typename: 'FormSection', id: number, title?: Types.Maybe<string>, position: number, form_items: Array<{ __typename: 'FormItem', id: number, admin_description?: Types.Maybe<string>, public_description?: Types.Maybe<string>, properties?: Types.Maybe<any>, position: number, identifier?: Types.Maybe<string>, item_type: string, rendered_properties?: Types.Maybe<any>, default_value?: Types.Maybe<any>, visibility: Types.FormItemRole, writeability: Types.FormItemRole }> }> };

export type FormAdminQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type FormAdminQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: number, name: string, forms: Array<{ __typename: 'Form', id: number, title: string, form_type: Types.FormType, export_json: any, event_categories: Array<{ __typename: 'EventCategory', id: number, name: string }>, proposal_event_categories: Array<{ __typename: 'EventCategory', id: number, name: string }>, user_con_profile_conventions: Array<{ __typename: 'Convention', id: number, name: string }> }> } };

export type FormEditorQueryVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type FormEditorQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: number, name: string, starts_at?: Types.Maybe<any>, ends_at?: Types.Maybe<any>, timezone_name?: Types.Maybe<string>, timezone_mode: Types.TimezoneMode, event_mailing_list_domain?: Types.Maybe<string> }, form: { __typename: 'Form', id: number, title: string, form_type: Types.FormType, form_sections: Array<{ __typename: 'FormSection', id: number, title?: Types.Maybe<string>, position: number, form_items: Array<{ __typename: 'FormItem', id: number, admin_description?: Types.Maybe<string>, public_description?: Types.Maybe<string>, properties?: Types.Maybe<any>, position: number, identifier?: Types.Maybe<string>, item_type: string, rendered_properties?: Types.Maybe<any>, default_value?: Types.Maybe<any>, visibility: Types.FormItemRole, writeability: Types.FormItemRole }> }> } };

export type PreviewFormItemQueryVariables = Types.Exact<{
  formSectionId: Types.Scalars['Int'];
  formItem: Types.FormItemInput;
}>;


export type PreviewFormItemQueryData = { __typename: 'Query', previewFormItem: { __typename: 'FormItem', id: number, admin_description?: Types.Maybe<string>, public_description?: Types.Maybe<string>, properties?: Types.Maybe<any>, position: number, identifier?: Types.Maybe<string>, item_type: string, rendered_properties?: Types.Maybe<any>, default_value?: Types.Maybe<any>, visibility: Types.FormItemRole, writeability: Types.FormItemRole } };

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
  convention: assertConvention {
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
 * __useFormAdminQuery__
 *
 * To run a query within a React component, call `useFormAdminQuery` and pass it any options that fit your needs.
 * When your component renders, `useFormAdminQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFormAdminQuery({
 *   variables: {
 *   },
 * });
 */
export function useFormAdminQuery(baseOptions?: Apollo.QueryHookOptions<FormAdminQueryData, FormAdminQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FormAdminQueryData, FormAdminQueryVariables>(FormAdminQueryDocument, options);
      }
export function useFormAdminQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FormAdminQueryData, FormAdminQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FormAdminQueryData, FormAdminQueryVariables>(FormAdminQueryDocument, options);
        }
export type FormAdminQueryHookResult = ReturnType<typeof useFormAdminQuery>;
export type FormAdminQueryLazyQueryHookResult = ReturnType<typeof useFormAdminQueryLazyQuery>;
export type FormAdminQueryQueryResult = Apollo.QueryResult<FormAdminQueryData, FormAdminQueryVariables>;
export const FormEditorQueryDocument = gql`
    query FormEditorQuery($id: Int!) {
  convention: assertConvention {
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
 * __useFormEditorQuery__
 *
 * To run a query within a React component, call `useFormEditorQuery` and pass it any options that fit your needs.
 * When your component renders, `useFormEditorQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFormEditorQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useFormEditorQuery(baseOptions: Apollo.QueryHookOptions<FormEditorQueryData, FormEditorQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FormEditorQueryData, FormEditorQueryVariables>(FormEditorQueryDocument, options);
      }
export function useFormEditorQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FormEditorQueryData, FormEditorQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FormEditorQueryData, FormEditorQueryVariables>(FormEditorQueryDocument, options);
        }
export type FormEditorQueryHookResult = ReturnType<typeof useFormEditorQuery>;
export type FormEditorQueryLazyQueryHookResult = ReturnType<typeof useFormEditorQueryLazyQuery>;
export type FormEditorQueryQueryResult = Apollo.QueryResult<FormEditorQueryData, FormEditorQueryVariables>;
export const PreviewFormItemQueryDocument = gql`
    query PreviewFormItemQuery($formSectionId: Int!, $formItem: FormItemInput!) {
  previewFormItem(formSectionId: $formSectionId, formItem: $formItem) {
    id
    ...FormEditorFormItemFields
  }
}
    ${FormEditorFormItemFieldsFragmentDoc}`;

/**
 * __usePreviewFormItemQuery__
 *
 * To run a query within a React component, call `usePreviewFormItemQuery` and pass it any options that fit your needs.
 * When your component renders, `usePreviewFormItemQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePreviewFormItemQuery({
 *   variables: {
 *      formSectionId: // value for 'formSectionId'
 *      formItem: // value for 'formItem'
 *   },
 * });
 */
export function usePreviewFormItemQuery(baseOptions: Apollo.QueryHookOptions<PreviewFormItemQueryData, PreviewFormItemQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PreviewFormItemQueryData, PreviewFormItemQueryVariables>(PreviewFormItemQueryDocument, options);
      }
export function usePreviewFormItemQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PreviewFormItemQueryData, PreviewFormItemQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PreviewFormItemQueryData, PreviewFormItemQueryVariables>(PreviewFormItemQueryDocument, options);
        }
export type PreviewFormItemQueryHookResult = ReturnType<typeof usePreviewFormItemQuery>;
export type PreviewFormItemQueryLazyQueryHookResult = ReturnType<typeof usePreviewFormItemQueryLazyQuery>;
export type PreviewFormItemQueryQueryResult = Apollo.QueryResult<PreviewFormItemQueryData, PreviewFormItemQueryVariables>;