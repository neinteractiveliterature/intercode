/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type RootSiteConventionsAdminTableQueryVariables = Types.Exact<{
  page?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  filters?: Types.InputMaybe<Types.ConventionFiltersInput>;
  sort?: Types.InputMaybe<Array<Types.SortInput> | Types.SortInput>;
}>;


export type RootSiteConventionsAdminTableQueryData = { __typename: 'Query', conventions_paginated: { __typename: 'ConventionsPagination', total_entries: number, total_pages: number, entries: Array<{ __typename: 'Convention', id: string, name: string, starts_at?: string | null, ends_at?: string | null, timezone_name?: string | null, timezone_mode: Types.TimezoneMode, organization?: { __typename: 'Organization', id: string, name: string } | null }> } };

export type ConventionDisplayFieldsFragment = { __typename: 'Convention', id: string, name: string, starts_at?: string | null, ends_at?: string | null, canceled: boolean, timezone_name?: string | null, timezone_mode: Types.TimezoneMode, domain?: string | null, site_mode: Types.SiteMode, ticket_mode: Types.TicketMode, show_event_list?: Types.ShowSchedule | null, show_schedule?: Types.ShowSchedule | null, email_from: string, hidden: boolean, language: string, signup_rounds: Array<{ __typename: 'SignupRound', id: string, start?: string | null, maximum_event_signups: string }>, organization?: { __typename: 'Organization', id: string, name: string } | null };

export type ConventionDisplayQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type ConventionDisplayQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, name: string, starts_at?: string | null, ends_at?: string | null, canceled: boolean, timezone_name?: string | null, timezone_mode: Types.TimezoneMode, domain?: string | null, site_mode: Types.SiteMode, ticket_mode: Types.TicketMode, show_event_list?: Types.ShowSchedule | null, show_schedule?: Types.ShowSchedule | null, email_from: string, hidden: boolean, language: string, signup_rounds: Array<{ __typename: 'SignupRound', id: string, start?: string | null, maximum_event_signups: string }>, organization?: { __typename: 'Organization', id: string, name: string } | null } };

export type NewConventionModalQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type NewConventionModalQueryData = { __typename: 'Query', organizations: Array<{ __typename: 'Organization', id: string, name: string }> };

export const ConventionDisplayFieldsFragmentDoc = gql`
    fragment ConventionDisplayFields on Convention {
  id
  name
  starts_at
  ends_at
  canceled
  timezone_name
  timezone_mode
  domain
  site_mode
  ticket_mode
  show_event_list
  show_schedule
  email_from
  hidden
  language
  signup_rounds {
    id
    start
    maximum_event_signups
  }
  organization {
    id
    name
  }
}
    `;
export const RootSiteConventionsAdminTableQueryDocument = gql`
    query RootSiteConventionsAdminTableQuery($page: Int, $filters: ConventionFiltersInput, $sort: [SortInput!]) {
  conventions_paginated(page: $page, filters: $filters, sort: $sort) {
    total_entries
    total_pages
    entries {
      id
      name
      starts_at
      ends_at
      timezone_name
      timezone_mode
      organization {
        id
        name
      }
    }
  }
}
    `;

/**
 * __useRootSiteConventionsAdminTableQuery__
 *
 * To run a query within a React component, call `useRootSiteConventionsAdminTableQuery` and pass it any options that fit your needs.
 * When your component renders, `useRootSiteConventionsAdminTableQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRootSiteConventionsAdminTableQuery({
 *   variables: {
 *      page: // value for 'page'
 *      filters: // value for 'filters'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useRootSiteConventionsAdminTableQuery(baseOptions?: Apollo.QueryHookOptions<RootSiteConventionsAdminTableQueryData, RootSiteConventionsAdminTableQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RootSiteConventionsAdminTableQueryData, RootSiteConventionsAdminTableQueryVariables>(RootSiteConventionsAdminTableQueryDocument, options);
      }
export function useRootSiteConventionsAdminTableQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RootSiteConventionsAdminTableQueryData, RootSiteConventionsAdminTableQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RootSiteConventionsAdminTableQueryData, RootSiteConventionsAdminTableQueryVariables>(RootSiteConventionsAdminTableQueryDocument, options);
        }
export function useRootSiteConventionsAdminTableQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<RootSiteConventionsAdminTableQueryData, RootSiteConventionsAdminTableQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<RootSiteConventionsAdminTableQueryData, RootSiteConventionsAdminTableQueryVariables>(RootSiteConventionsAdminTableQueryDocument, options);
        }
export type RootSiteConventionsAdminTableQueryHookResult = ReturnType<typeof useRootSiteConventionsAdminTableQuery>;
export type RootSiteConventionsAdminTableQueryLazyQueryHookResult = ReturnType<typeof useRootSiteConventionsAdminTableQueryLazyQuery>;
export type RootSiteConventionsAdminTableQuerySuspenseQueryHookResult = ReturnType<typeof useRootSiteConventionsAdminTableQuerySuspenseQuery>;
export type RootSiteConventionsAdminTableQueryQueryResult = Apollo.QueryResult<RootSiteConventionsAdminTableQueryData, RootSiteConventionsAdminTableQueryVariables>;
export const ConventionDisplayQueryDocument = gql`
    query ConventionDisplayQuery($id: ID!) {
  convention: conventionById(id: $id) {
    id
    ...ConventionDisplayFields
  }
}
    ${ConventionDisplayFieldsFragmentDoc}`;

/**
 * __useConventionDisplayQuery__
 *
 * To run a query within a React component, call `useConventionDisplayQuery` and pass it any options that fit your needs.
 * When your component renders, `useConventionDisplayQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useConventionDisplayQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useConventionDisplayQuery(baseOptions: Apollo.QueryHookOptions<ConventionDisplayQueryData, ConventionDisplayQueryVariables> & ({ variables: ConventionDisplayQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ConventionDisplayQueryData, ConventionDisplayQueryVariables>(ConventionDisplayQueryDocument, options);
      }
export function useConventionDisplayQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ConventionDisplayQueryData, ConventionDisplayQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ConventionDisplayQueryData, ConventionDisplayQueryVariables>(ConventionDisplayQueryDocument, options);
        }
export function useConventionDisplayQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ConventionDisplayQueryData, ConventionDisplayQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ConventionDisplayQueryData, ConventionDisplayQueryVariables>(ConventionDisplayQueryDocument, options);
        }
export type ConventionDisplayQueryHookResult = ReturnType<typeof useConventionDisplayQuery>;
export type ConventionDisplayQueryLazyQueryHookResult = ReturnType<typeof useConventionDisplayQueryLazyQuery>;
export type ConventionDisplayQuerySuspenseQueryHookResult = ReturnType<typeof useConventionDisplayQuerySuspenseQuery>;
export type ConventionDisplayQueryQueryResult = Apollo.QueryResult<ConventionDisplayQueryData, ConventionDisplayQueryVariables>;
export const NewConventionModalQueryDocument = gql`
    query NewConventionModalQuery {
  organizations {
    id
    name
  }
}
    `;

/**
 * __useNewConventionModalQuery__
 *
 * To run a query within a React component, call `useNewConventionModalQuery` and pass it any options that fit your needs.
 * When your component renders, `useNewConventionModalQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewConventionModalQuery({
 *   variables: {
 *   },
 * });
 */
export function useNewConventionModalQuery(baseOptions?: Apollo.QueryHookOptions<NewConventionModalQueryData, NewConventionModalQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NewConventionModalQueryData, NewConventionModalQueryVariables>(NewConventionModalQueryDocument, options);
      }
export function useNewConventionModalQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NewConventionModalQueryData, NewConventionModalQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NewConventionModalQueryData, NewConventionModalQueryVariables>(NewConventionModalQueryDocument, options);
        }
export function useNewConventionModalQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<NewConventionModalQueryData, NewConventionModalQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<NewConventionModalQueryData, NewConventionModalQueryVariables>(NewConventionModalQueryDocument, options);
        }
export type NewConventionModalQueryHookResult = ReturnType<typeof useNewConventionModalQuery>;
export type NewConventionModalQueryLazyQueryHookResult = ReturnType<typeof useNewConventionModalQueryLazyQuery>;
export type NewConventionModalQuerySuspenseQueryHookResult = ReturnType<typeof useNewConventionModalQuerySuspenseQuery>;
export type NewConventionModalQueryQueryResult = Apollo.QueryResult<NewConventionModalQueryData, NewConventionModalQueryVariables>;