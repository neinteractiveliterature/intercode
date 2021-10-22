/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { CommonFormFieldsFragmentDoc, CommonFormSectionFieldsFragmentDoc, CommonFormItemFieldsFragmentDoc } from '../Models/commonFormFragments.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type MyProfileQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type MyProfileQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, name: string, starts_at?: string | null | undefined, ends_at?: string | null | undefined, timezone_name?: string | null | undefined, timezone_mode: Types.TimezoneMode, my_profile?: { __typename: 'UserConProfile', id: string, email?: string | null | undefined, form_response_attrs_json?: string | null | undefined, can_have_bio: boolean, gravatar_url: string, gravatar_enabled: boolean, bio?: string | null | undefined, show_nickname_in_bio?: boolean | null | undefined, bio_name?: string | null | undefined, bio_html?: string | null | undefined, current_user_form_item_viewer_role: Types.FormItemRole, current_user_form_item_writer_role: Types.FormItemRole } | null | undefined, user_con_profile_form: { __typename: 'Form', id: string, title: string, form_type: Types.FormType, form_sections: Array<{ __typename: 'FormSection', id: string, title?: string | null | undefined, position: number, form_items: Array<{ __typename: 'FormItem', id: string, admin_description?: string | null | undefined, position: number, identifier?: string | null | undefined, item_type: string, rendered_properties: string, default_value?: string | null | undefined, visibility: Types.FormItemRole, writeability: Types.FormItemRole }> }> } } };


export const MyProfileQueryDocument = gql`
    query MyProfileQuery {
  convention: conventionByRequestHost {
    id
    name
    starts_at
    ends_at
    timezone_name
    timezone_mode
    my_profile {
      id
      email
      form_response_attrs_json
      can_have_bio
      gravatar_url
      gravatar_enabled
      bio
      show_nickname_in_bio
      bio_name
      bio_html
      current_user_form_item_viewer_role
      current_user_form_item_writer_role
    }
    user_con_profile_form {
      id
      ...CommonFormFields
      form_sections {
        id
        form_items {
          id
          admin_description
        }
      }
    }
  }
}
    ${CommonFormFieldsFragmentDoc}`;

/**
 * __useMyProfileQuery__
 *
 * To run a query within a React component, call `useMyProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyProfileQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyProfileQuery(baseOptions?: Apollo.QueryHookOptions<MyProfileQueryData, MyProfileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyProfileQueryData, MyProfileQueryVariables>(MyProfileQueryDocument, options);
      }
export function useMyProfileQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyProfileQueryData, MyProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyProfileQueryData, MyProfileQueryVariables>(MyProfileQueryDocument, options);
        }
export type MyProfileQueryHookResult = ReturnType<typeof useMyProfileQuery>;
export type MyProfileQueryLazyQueryHookResult = ReturnType<typeof useMyProfileQueryLazyQuery>;
export type MyProfileQueryQueryResult = Apollo.QueryResult<MyProfileQueryData, MyProfileQueryVariables>;