/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type RootSiteConventionsAdminTableQueryQueryVariables = Types.Exact<{
  page?: Types.Maybe<Types.Scalars['Int']>;
  filters?: Types.Maybe<Types.ConventionFiltersInput>;
  sort?: Types.Maybe<Array<Types.SortInput>>;
}>;


export type RootSiteConventionsAdminTableQueryQuery = (
  { __typename: 'Query' }
  & { conventions_paginated: (
    { __typename: 'ConventionsPagination' }
    & Pick<Types.ConventionsPagination, 'total_entries' | 'total_pages'>
    & { entries: Array<(
      { __typename: 'Convention' }
      & Pick<Types.Convention, 'id' | 'name' | 'starts_at' | 'ends_at' | 'timezone_name'>
      & { organization?: Types.Maybe<(
        { __typename: 'Organization' }
        & Pick<Types.Organization, 'id' | 'name'>
      )> }
    )> }
  ) }
);

export type ConventionDisplayFieldsFragment = (
  { __typename: 'Convention' }
  & Pick<Types.Convention, 'id' | 'name' | 'starts_at' | 'ends_at' | 'canceled' | 'timezone_name' | 'domain' | 'site_mode' | 'ticket_mode' | 'show_event_list' | 'show_schedule' | 'email_from'>
  & { maximum_event_signups?: Types.Maybe<(
    { __typename: 'ScheduledValue' }
    & { timespans: Array<(
      { __typename: 'TimespanWithValue' }
      & Pick<Types.TimespanWithValue, 'start' | 'finish' | 'value'>
    )> }
  )>, organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id' | 'name'>
  )> }
);

export type ConventionDisplayQueryQueryVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type ConventionDisplayQueryQuery = (
  { __typename: 'Query' }
  & { convention: (
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & ConventionDisplayFieldsFragment
  ) }
);

export type NewConventionModalQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type NewConventionModalQueryQuery = (
  { __typename: 'Query' }
  & { organizations: Array<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id' | 'name'>
  )> }
);

export const ConventionDisplayFieldsFragmentDoc = gql`
    fragment ConventionDisplayFields on Convention {
  id
  name
  starts_at
  ends_at
  canceled
  timezone_name
  domain
  site_mode
  ticket_mode
  show_event_list
  show_schedule
  email_from
  maximum_event_signups {
    timespans {
      start
      finish
      value
    }
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
      organization {
        id
        name
      }
    }
  }
}
    `;

/**
 * __useRootSiteConventionsAdminTableQueryQuery__
 *
 * To run a query within a React component, call `useRootSiteConventionsAdminTableQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useRootSiteConventionsAdminTableQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRootSiteConventionsAdminTableQueryQuery({
 *   variables: {
 *      page: // value for 'page'
 *      filters: // value for 'filters'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useRootSiteConventionsAdminTableQueryQuery(baseOptions?: Apollo.QueryHookOptions<RootSiteConventionsAdminTableQueryQuery, RootSiteConventionsAdminTableQueryQueryVariables>) {
        return Apollo.useQuery<RootSiteConventionsAdminTableQueryQuery, RootSiteConventionsAdminTableQueryQueryVariables>(RootSiteConventionsAdminTableQueryDocument, baseOptions);
      }
export function useRootSiteConventionsAdminTableQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RootSiteConventionsAdminTableQueryQuery, RootSiteConventionsAdminTableQueryQueryVariables>) {
          return Apollo.useLazyQuery<RootSiteConventionsAdminTableQueryQuery, RootSiteConventionsAdminTableQueryQueryVariables>(RootSiteConventionsAdminTableQueryDocument, baseOptions);
        }
export type RootSiteConventionsAdminTableQueryQueryHookResult = ReturnType<typeof useRootSiteConventionsAdminTableQueryQuery>;
export type RootSiteConventionsAdminTableQueryLazyQueryHookResult = ReturnType<typeof useRootSiteConventionsAdminTableQueryLazyQuery>;
export type RootSiteConventionsAdminTableQueryQueryResult = Apollo.QueryResult<RootSiteConventionsAdminTableQueryQuery, RootSiteConventionsAdminTableQueryQueryVariables>;
export const ConventionDisplayQueryDocument = gql`
    query ConventionDisplayQuery($id: Int!) {
  convention: conventionById(id: $id) {
    id
    ...ConventionDisplayFields
  }
}
    ${ConventionDisplayFieldsFragmentDoc}`;

/**
 * __useConventionDisplayQueryQuery__
 *
 * To run a query within a React component, call `useConventionDisplayQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useConventionDisplayQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useConventionDisplayQueryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useConventionDisplayQueryQuery(baseOptions?: Apollo.QueryHookOptions<ConventionDisplayQueryQuery, ConventionDisplayQueryQueryVariables>) {
        return Apollo.useQuery<ConventionDisplayQueryQuery, ConventionDisplayQueryQueryVariables>(ConventionDisplayQueryDocument, baseOptions);
      }
export function useConventionDisplayQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ConventionDisplayQueryQuery, ConventionDisplayQueryQueryVariables>) {
          return Apollo.useLazyQuery<ConventionDisplayQueryQuery, ConventionDisplayQueryQueryVariables>(ConventionDisplayQueryDocument, baseOptions);
        }
export type ConventionDisplayQueryQueryHookResult = ReturnType<typeof useConventionDisplayQueryQuery>;
export type ConventionDisplayQueryLazyQueryHookResult = ReturnType<typeof useConventionDisplayQueryLazyQuery>;
export type ConventionDisplayQueryQueryResult = Apollo.QueryResult<ConventionDisplayQueryQuery, ConventionDisplayQueryQueryVariables>;
export const NewConventionModalQueryDocument = gql`
    query NewConventionModalQuery {
  organizations {
    id
    name
  }
}
    `;

/**
 * __useNewConventionModalQueryQuery__
 *
 * To run a query within a React component, call `useNewConventionModalQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useNewConventionModalQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewConventionModalQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useNewConventionModalQueryQuery(baseOptions?: Apollo.QueryHookOptions<NewConventionModalQueryQuery, NewConventionModalQueryQueryVariables>) {
        return Apollo.useQuery<NewConventionModalQueryQuery, NewConventionModalQueryQueryVariables>(NewConventionModalQueryDocument, baseOptions);
      }
export function useNewConventionModalQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NewConventionModalQueryQuery, NewConventionModalQueryQueryVariables>) {
          return Apollo.useLazyQuery<NewConventionModalQueryQuery, NewConventionModalQueryQueryVariables>(NewConventionModalQueryDocument, baseOptions);
        }
export type NewConventionModalQueryQueryHookResult = ReturnType<typeof useNewConventionModalQueryQuery>;
export type NewConventionModalQueryLazyQueryHookResult = ReturnType<typeof useNewConventionModalQueryLazyQuery>;
export type NewConventionModalQueryQueryResult = Apollo.QueryResult<NewConventionModalQueryQuery, NewConventionModalQueryQueryVariables>;