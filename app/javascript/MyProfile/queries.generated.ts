/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { CommonFormFieldsFragment, CommonFormSectionFieldsFragment, CommonFormItemFieldsFragment } from '../Models/commonFormFragments.generated';
import { gql } from '@apollo/client';
import { CommonFormFieldsFragmentDoc, CommonFormSectionFieldsFragmentDoc, CommonFormItemFieldsFragmentDoc } from '../Models/commonFormFragments.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type MyProfileQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type MyProfileQueryData = (
  { __typename: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'name' | 'starts_at' | 'ends_at' | 'timezone_name' | 'timezone_mode'>
    & { user_con_profile_form: (
      { __typename: 'Form' }
      & Pick<Types.Form, 'id'>
      & { form_sections: Array<(
        { __typename: 'FormSection' }
        & Pick<Types.FormSection, 'id'>
        & { form_items: Array<(
          { __typename: 'FormItem' }
          & Pick<Types.FormItem, 'id' | 'admin_description'>
        )> }
      )> }
      & CommonFormFieldsFragment
    ) }
  )>, myProfile?: Types.Maybe<(
    { __typename: 'UserConProfile' }
    & Pick<Types.UserConProfile, 'id' | 'email' | 'form_response_attrs_json' | 'can_have_bio' | 'gravatar_url' | 'gravatar_enabled' | 'bio' | 'show_nickname_in_bio' | 'bio_name' | 'bio_html'>
  )> }
);


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