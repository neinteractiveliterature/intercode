/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type UsersTableUsersQueryQueryVariables = Types.Exact<{
  page?: Types.Maybe<Types.Scalars['Int']>;
  perPage?: Types.Maybe<Types.Scalars['Int']>;
  filters?: Types.Maybe<Types.UserFiltersInput>;
  sort?: Types.Maybe<Array<Types.SortInput>>;
}>;


export type UsersTableUsersQueryQuery = (
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

export type UserAdminQueryQueryVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type UserAdminQueryQuery = (
  { __typename: 'Query' }
  & { user: (
    { __typename: 'User' }
    & Pick<Types.User, 'id'>
    & DetailedUserFieldsFragment
  ) }
);

export type MergeUsersModalQueryQueryVariables = Types.Exact<{
  ids: Array<Types.Scalars['Int']>;
}>;


export type MergeUsersModalQueryQuery = (
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
 * __useUsersTableUsersQueryQuery__
 *
 * To run a query within a React component, call `useUsersTableUsersQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersTableUsersQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersTableUsersQueryQuery({
 *   variables: {
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *      filters: // value for 'filters'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useUsersTableUsersQueryQuery(baseOptions?: Apollo.QueryHookOptions<UsersTableUsersQueryQuery, UsersTableUsersQueryQueryVariables>) {
        return Apollo.useQuery<UsersTableUsersQueryQuery, UsersTableUsersQueryQueryVariables>(UsersTableUsersQueryDocument, baseOptions);
      }
export function useUsersTableUsersQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersTableUsersQueryQuery, UsersTableUsersQueryQueryVariables>) {
          return Apollo.useLazyQuery<UsersTableUsersQueryQuery, UsersTableUsersQueryQueryVariables>(UsersTableUsersQueryDocument, baseOptions);
        }
export type UsersTableUsersQueryQueryHookResult = ReturnType<typeof useUsersTableUsersQueryQuery>;
export type UsersTableUsersQueryLazyQueryHookResult = ReturnType<typeof useUsersTableUsersQueryLazyQuery>;
export type UsersTableUsersQueryQueryResult = Apollo.QueryResult<UsersTableUsersQueryQuery, UsersTableUsersQueryQueryVariables>;
export const UserAdminQueryDocument = gql`
    query UserAdminQuery($id: Int!) {
  user(id: $id) {
    id
    ...DetailedUserFields
  }
}
    ${DetailedUserFieldsFragmentDoc}`;

/**
 * __useUserAdminQueryQuery__
 *
 * To run a query within a React component, call `useUserAdminQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserAdminQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserAdminQueryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUserAdminQueryQuery(baseOptions: Apollo.QueryHookOptions<UserAdminQueryQuery, UserAdminQueryQueryVariables>) {
        return Apollo.useQuery<UserAdminQueryQuery, UserAdminQueryQueryVariables>(UserAdminQueryDocument, baseOptions);
      }
export function useUserAdminQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserAdminQueryQuery, UserAdminQueryQueryVariables>) {
          return Apollo.useLazyQuery<UserAdminQueryQuery, UserAdminQueryQueryVariables>(UserAdminQueryDocument, baseOptions);
        }
export type UserAdminQueryQueryHookResult = ReturnType<typeof useUserAdminQueryQuery>;
export type UserAdminQueryLazyQueryHookResult = ReturnType<typeof useUserAdminQueryLazyQuery>;
export type UserAdminQueryQueryResult = Apollo.QueryResult<UserAdminQueryQuery, UserAdminQueryQueryVariables>;
export const MergeUsersModalQueryDocument = gql`
    query MergeUsersModalQuery($ids: [Int!]!) {
  users(ids: $ids) {
    id
    ...DetailedUserFields
  }
}
    ${DetailedUserFieldsFragmentDoc}`;

/**
 * __useMergeUsersModalQueryQuery__
 *
 * To run a query within a React component, call `useMergeUsersModalQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useMergeUsersModalQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMergeUsersModalQueryQuery({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useMergeUsersModalQueryQuery(baseOptions: Apollo.QueryHookOptions<MergeUsersModalQueryQuery, MergeUsersModalQueryQueryVariables>) {
        return Apollo.useQuery<MergeUsersModalQueryQuery, MergeUsersModalQueryQueryVariables>(MergeUsersModalQueryDocument, baseOptions);
      }
export function useMergeUsersModalQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MergeUsersModalQueryQuery, MergeUsersModalQueryQueryVariables>) {
          return Apollo.useLazyQuery<MergeUsersModalQueryQuery, MergeUsersModalQueryQueryVariables>(MergeUsersModalQueryDocument, baseOptions);
        }
export type MergeUsersModalQueryQueryHookResult = ReturnType<typeof useMergeUsersModalQueryQuery>;
export type MergeUsersModalQueryLazyQueryHookResult = ReturnType<typeof useMergeUsersModalQueryLazyQuery>;
export type MergeUsersModalQueryQueryResult = Apollo.QueryResult<MergeUsersModalQueryQuery, MergeUsersModalQueryQueryVariables>;