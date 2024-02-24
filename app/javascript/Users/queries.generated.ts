/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UsersTableUsersQueryVariables = Types.Exact<{
  page?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  perPage?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  filters?: Types.InputMaybe<Types.UserFiltersInput>;
  sort?: Types.InputMaybe<Array<Types.SortInput> | Types.SortInput>;
}>;


export type UsersTableUsersQueryData = { __typename: 'Query', users_paginated: { __typename: 'UsersPagination', total_entries: number, total_pages: number, current_page: number, per_page: number, entries: Array<{ __typename: 'User', id: string, name_inverted?: string | null, first_name?: string | null, last_name?: string | null, email?: string | null, privileges?: Array<string> | null }> }, currentAbility: { __typename: 'Ability', can_create_user_con_profiles: boolean } };

export type DetailedUserFieldsFragment = { __typename: 'User', id: string, name?: string | null, first_name?: string | null, last_name?: string | null, email?: string | null, privileges?: Array<string> | null, user_con_profiles: Array<{ __typename: 'UserConProfile', id: string, email?: string | null, ticket?: { __typename: 'Ticket', id: string } | null, signups: Array<{ __typename: 'Signup', id: string, state: Types.SignupState }>, convention: { __typename: 'Convention', id: string, name: string, domain?: string | null, starts_at?: string | null, ticket_name: string, timezone_name?: string | null, timezone_mode: Types.TimezoneMode }, staff_positions: Array<{ __typename: 'StaffPosition', id: string, name: string }> }> };

export type UserAdminQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type UserAdminQueryData = { __typename: 'Query', user: { __typename: 'User', id: string, name?: string | null, first_name?: string | null, last_name?: string | null, email?: string | null, privileges?: Array<string> | null, user_con_profiles: Array<{ __typename: 'UserConProfile', id: string, email?: string | null, ticket?: { __typename: 'Ticket', id: string } | null, signups: Array<{ __typename: 'Signup', id: string, state: Types.SignupState }>, convention: { __typename: 'Convention', id: string, name: string, domain?: string | null, starts_at?: string | null, ticket_name: string, timezone_name?: string | null, timezone_mode: Types.TimezoneMode }, staff_positions: Array<{ __typename: 'StaffPosition', id: string, name: string }> }> } };

export type MergeUsersModalQueryVariables = Types.Exact<{
  ids: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
}>;


export type MergeUsersModalQueryData = { __typename: 'Query', users: Array<{ __typename: 'User', id: string, name?: string | null, first_name?: string | null, last_name?: string | null, email?: string | null, privileges?: Array<string> | null, user_con_profiles: Array<{ __typename: 'UserConProfile', id: string, email?: string | null, ticket?: { __typename: 'Ticket', id: string } | null, signups: Array<{ __typename: 'Signup', id: string, state: Types.SignupState }>, convention: { __typename: 'Convention', id: string, name: string, domain?: string | null, starts_at?: string | null, ticket_name: string, timezone_name?: string | null, timezone_mode: Types.TimezoneMode }, staff_positions: Array<{ __typename: 'StaffPosition', id: string, name: string }> }> }> };

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
export function useUsersTableUsersQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<UsersTableUsersQueryData, UsersTableUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UsersTableUsersQueryData, UsersTableUsersQueryVariables>(UsersTableUsersQueryDocument, options);
        }
export type UsersTableUsersQueryHookResult = ReturnType<typeof useUsersTableUsersQuery>;
export type UsersTableUsersQueryLazyQueryHookResult = ReturnType<typeof useUsersTableUsersQueryLazyQuery>;
export type UsersTableUsersQuerySuspenseQueryHookResult = ReturnType<typeof useUsersTableUsersQuerySuspenseQuery>;
export type UsersTableUsersQueryQueryResult = Apollo.QueryResult<UsersTableUsersQueryData, UsersTableUsersQueryVariables>;
export const UserAdminQueryDocument = gql`
    query UserAdminQuery($id: ID!) {
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
export function useUserAdminQuery(baseOptions: Apollo.QueryHookOptions<UserAdminQueryData, UserAdminQueryVariables> & ({ variables: UserAdminQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserAdminQueryData, UserAdminQueryVariables>(UserAdminQueryDocument, options);
      }
export function useUserAdminQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserAdminQueryData, UserAdminQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserAdminQueryData, UserAdminQueryVariables>(UserAdminQueryDocument, options);
        }
export function useUserAdminQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<UserAdminQueryData, UserAdminQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UserAdminQueryData, UserAdminQueryVariables>(UserAdminQueryDocument, options);
        }
export type UserAdminQueryHookResult = ReturnType<typeof useUserAdminQuery>;
export type UserAdminQueryLazyQueryHookResult = ReturnType<typeof useUserAdminQueryLazyQuery>;
export type UserAdminQuerySuspenseQueryHookResult = ReturnType<typeof useUserAdminQuerySuspenseQuery>;
export type UserAdminQueryQueryResult = Apollo.QueryResult<UserAdminQueryData, UserAdminQueryVariables>;
export const MergeUsersModalQueryDocument = gql`
    query MergeUsersModalQuery($ids: [ID!]!) {
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
export function useMergeUsersModalQuery(baseOptions: Apollo.QueryHookOptions<MergeUsersModalQueryData, MergeUsersModalQueryVariables> & ({ variables: MergeUsersModalQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MergeUsersModalQueryData, MergeUsersModalQueryVariables>(MergeUsersModalQueryDocument, options);
      }
export function useMergeUsersModalQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MergeUsersModalQueryData, MergeUsersModalQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MergeUsersModalQueryData, MergeUsersModalQueryVariables>(MergeUsersModalQueryDocument, options);
        }
export function useMergeUsersModalQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MergeUsersModalQueryData, MergeUsersModalQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MergeUsersModalQueryData, MergeUsersModalQueryVariables>(MergeUsersModalQueryDocument, options);
        }
export type MergeUsersModalQueryHookResult = ReturnType<typeof useMergeUsersModalQuery>;
export type MergeUsersModalQueryLazyQueryHookResult = ReturnType<typeof useMergeUsersModalQueryLazyQuery>;
export type MergeUsersModalQuerySuspenseQueryHookResult = ReturnType<typeof useMergeUsersModalQuerySuspenseQuery>;
export type MergeUsersModalQueryQueryResult = Apollo.QueryResult<MergeUsersModalQueryData, MergeUsersModalQueryVariables>;