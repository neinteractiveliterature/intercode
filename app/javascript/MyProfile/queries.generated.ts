/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { CommonFormFieldsFragmentDoc, CommonFormSectionFieldsFragmentDoc, CommonFormItemFieldsFragmentDoc } from '../Models/commonFormFragments.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type MyProfileQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type MyProfileQueryData = { __typename: 'Query', convention?: Types.Maybe<{ __typename: 'Convention', id: number, name: string, starts_at?: Types.Maybe<any>, ends_at?: Types.Maybe<any>, timezone_name?: Types.Maybe<string>, timezone_mode: Types.TimezoneMode, user_con_profile_form: { __typename: 'Form', id: number, title: string, form_type: Types.FormType, form_sections: Array<{ __typename: 'FormSection', id: number, title?: Types.Maybe<string>, position?: Types.Maybe<number>, form_items: Array<{ __typename: 'FormItem', id: number, admin_description?: Types.Maybe<string>, position?: Types.Maybe<number>, identifier?: Types.Maybe<string>, item_type: string, rendered_properties?: Types.Maybe<any>, default_value?: Types.Maybe<any>, visibility: Types.FormItemRole, writeability: Types.FormItemRole }> }> } }>, myProfile?: Types.Maybe<{ __typename: 'UserConProfile', id: number, email?: Types.Maybe<string>, form_response_attrs_json?: Types.Maybe<any>, can_have_bio: boolean, gravatar_url: string, gravatar_enabled: boolean, bio?: Types.Maybe<string>, show_nickname_in_bio?: Types.Maybe<boolean>, bio_name?: Types.Maybe<string>, bio_html?: Types.Maybe<string>, current_user_form_item_viewer_role: Types.FormItemRole, current_user_form_item_writer_role: Types.FormItemRole }> };


export const MyProfileQueryDocument = gql`
    query MyProfileQuery {
  convention {
    id
    name
    starts_at
    ends_at
    timezone_name
    timezone_mode
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
  myProfile {
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