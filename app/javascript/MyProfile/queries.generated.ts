/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { CommonFormFieldsFragment, CommonFormSectionFieldsFragment, CommonFormItemFieldsFragment } from '../Models/commonFormFragments.generated';
import gql from 'graphql-tag';
import { CommonFormFieldsFragmentDoc, CommonFormSectionFieldsFragmentDoc, CommonFormItemFieldsFragmentDoc } from '../Models/commonFormFragments.generated';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';


export type MyProfileQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type MyProfileQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id' | 'name' | 'starts_at' | 'ends_at' | 'timezone_name' | 'timezone_mode'>
    & { user_con_profile_form: (
      { __typename?: 'Form' }
      & Pick<Types.Form, 'id'>
      & CommonFormFieldsFragment
    ) }
  )>, myProfile?: Types.Maybe<(
    { __typename?: 'UserConProfile' }
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
 * __useMyProfileQueryQuery__
 *
 * To run a query within a React component, call `useMyProfileQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyProfileQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyProfileQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyProfileQueryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<MyProfileQueryQuery, MyProfileQueryQueryVariables>) {
        return ApolloReactHooks.useQuery<MyProfileQueryQuery, MyProfileQueryQueryVariables>(MyProfileQueryDocument, baseOptions);
      }
export function useMyProfileQueryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MyProfileQueryQuery, MyProfileQueryQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<MyProfileQueryQuery, MyProfileQueryQueryVariables>(MyProfileQueryDocument, baseOptions);
        }
export type MyProfileQueryQueryHookResult = ReturnType<typeof useMyProfileQueryQuery>;
export type MyProfileQueryLazyQueryHookResult = ReturnType<typeof useMyProfileQueryLazyQuery>;
export type MyProfileQueryQueryResult = ApolloReactCommon.QueryResult<MyProfileQueryQuery, MyProfileQueryQueryVariables>;