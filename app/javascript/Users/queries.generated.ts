/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type UsersTableUsersQueryVariables = Types.Exact<{
  page?: Types.Maybe<Types.Scalars['Int']>;
  perPage?: Types.Maybe<Types.Scalars['Int']>;
  filters?: Types.Maybe<Types.UserFiltersInput>;
  sort?: Types.Maybe<Array<Types.SortInput> | Types.SortInput>;
}>;


export type UsersTableUsersQueryData = (
  { __typename: 'Query' }
  & { users_paginated: (
    { __typename: 'UsersPagination' }
    & Pick<Types.UsersPagination, 'total_entries' | 'total_pages' | 'current_page' | 'per_page'>
    & { entries: Array<(
      { __typename: 'User' }
      & Pick<Types.User, 'id' | 'name_inverted' | 'first_name' | 'last_name' | 'email' | 'privileges'>
    )> }
  ), currentAbility: (
    { __typename: 'Ability' }
    & Pick<Types.Ability, 'can_create_user_con_profiles'>
  ) }
);

export type DetailedUserFieldsFragment = (
  { __typename: 'User' }
  & Pick<Types.User, 'id' | 'name' | 'first_name' | 'last_name' | 'email' | 'privileges'>
  & { user_con_profiles: Array<(
    { __typename: 'UserConProfile' }
    & Pick<Types.UserConProfile, 'id' | 'email'>
    & { ticket?: Types.Maybe<(
      { __typename: 'Ticket' }
      & Pick<Types.Ticket, 'id'>
    )>, signups: Array<(
      { __typename: 'Signup' }
      & Pick<Types.Signup, 'id' | 'state'>
    )>, convention: (
      { __typename: 'Convention' }
      & Pick<Types.Convention, 'id' | 'name' | 'domain' | 'starts_at' | 'ticket_name' | 'timezone_name' | 'timezone_mode'>
    ), staff_positions: Array<(
      { __typename: 'StaffPosition' }
      & Pick<Types.StaffPosition, 'id' | 'name'>
    )> }
  )> }
);

export type UserAdminQueryVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type UserAdminQueryData = (
  { __typename: 'Query' }
  & { user: (
    { __typename: 'User' }
    & Pick<Types.User, 'id'>
    & DetailedUserFieldsFragment
  ) }
);

export type MergeUsersModalQueryVariables = Types.Exact<{
  ids: Array<Types.Scalars['Int']> | Types.Scalars['Int'];
}>;


export type MergeUsersModalQueryData = (
  { __typename: 'Query' }
  & { users: Array<(
    { __typename: 'User' }
    & Pick<Types.User, 'id'>
    & DetailedUserFieldsFragment
  )> }
);

export const DetailedUserFieldsFragmentDoc = gql`
    fragment DetailedUserFields on User {
  id
  name
  first_name
  last_name
  email
  privileges
  user_con_profiles {
    id
    email
    ticket {
      id
    }
    signups {
      id
      state
    }
    convention {
      id
      name
      domain
      starts_at
      ticket_name
      timezone_name
      timezone_mode
    }
    staff_positions {
      id
      name
    }
  }
}
    `;
export const UsersTableUsersQueryDocument = gql`
    query UsersTableUsersQuery($page: Int, $perPage: Int, $filters: UserFiltersInput, $sort: [SortInput!]) {
  users_paginated(page: $page, per_page: $perPage, filters: $filters, sort: $sort) {
    total_entries
    total_pages
    current_page
    per_page
    entries {
      id
      name_inverted
      first_name
      last_name
      email
      privileges
    }
  }
  currentAbility {
    can_create_user_con_profiles
  }
}
    `;

/**
 * __useUsersTableUsersQuery__
 *
 * To run a query within a React component, call `useUsersTableUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersTableUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersTableUsersQuery({
 *   variables: {
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *      filters: // value for 'filters'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useUsersTableUsersQuery(baseOptions?: Apollo.QueryHookOptions<UsersTableUsersQueryData, UsersTableUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UsersTableUsersQueryData, UsersTableUsersQueryVariables>(UsersTableUsersQueryDocument, options);
      }
export function useUsersTableUsersQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersTableUsersQueryData, UsersTableUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UsersTableUsersQueryData, UsersTableUsersQueryVariables>(UsersTableUsersQueryDocument, options);
        }
export type UsersTableUsersQueryHookResult = ReturnType<typeof useUsersTableUsersQuery>;
export type UsersTableUsersQueryLazyQueryHookResult = ReturnType<typeof useUsersTableUsersQueryLazyQuery>;
export type UsersTableUsersQueryQueryResult = Apollo.QueryResult<UsersTableUsersQueryData, UsersTableUsersQueryVariables>;
export const UserAdminQueryDocument = gql`
    query UserAdminQuery($id: Int!) {
  user(id: $id) {
    id
    ...DetailedUserFields
  }
}
    ${DetailedUserFieldsFragmentDoc}`;

/**
 * __useUserAdminQuery__
 *
 * To run a query within a React component, call `useUserAdminQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserAdminQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserAdminQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUserAdminQuery(baseOptions: Apollo.QueryHookOptions<UserAdminQueryData, UserAdminQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserAdminQueryData, UserAdminQueryVariables>(UserAdminQueryDocument, options);
      }
export function useUserAdminQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserAdminQueryData, UserAdminQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserAdminQueryData, UserAdminQueryVariables>(UserAdminQueryDocument, options);
        }
export type UserAdminQueryHookResult = ReturnType<typeof useUserAdminQuery>;
export type UserAdminQueryLazyQueryHookResult = ReturnType<typeof useUserAdminQueryLazyQuery>;
export type UserAdminQueryQueryResult = Apollo.QueryResult<UserAdminQueryData, UserAdminQueryVariables>;
export const MergeUsersModalQueryDocument = gql`
    query MergeUsersModalQuery($ids: [Int!]!) {
  users(ids: $ids) {
    id
    ...DetailedUserFields
  }
}
    ${DetailedUserFieldsFragmentDoc}`;

/**
 * __useMergeUsersModalQuery__
 *
 * To run a query within a React component, call `useMergeUsersModalQuery` and pass it any options that fit your needs.
 * When your component renders, `useMergeUsersModalQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMergeUsersModalQuery({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useMergeUsersModalQuery(baseOptions: Apollo.QueryHookOptions<MergeUsersModalQueryData, MergeUsersModalQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MergeUsersModalQueryData, MergeUsersModalQueryVariables>(MergeUsersModalQueryDocument, options);
      }
export function useMergeUsersModalQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MergeUsersModalQueryData, MergeUsersModalQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MergeUsersModalQueryData, MergeUsersModalQueryVariables>(MergeUsersModalQueryDocument, options);
        }
export type MergeUsersModalQueryHookResult = ReturnType<typeof useMergeUsersModalQuery>;
export type MergeUsersModalQueryLazyQueryHookResult = ReturnType<typeof useMergeUsersModalQueryLazyQuery>;
export type MergeUsersModalQueryQueryResult = Apollo.QueryResult<MergeUsersModalQueryData, MergeUsersModalQueryVariables>;