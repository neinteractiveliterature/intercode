/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type EmailRouteFieldsFragment = (
  { __typename?: 'EmailRoute' }
  & Pick<Types.EmailRoute, 'id' | 'receiver_address' | 'forward_addresses'>
);

export type RootSiteEmailRoutesAdminTableQueryQueryVariables = Types.Exact<{
  page?: Types.Maybe<Types.Scalars['Int']>;
  filters?: Types.Maybe<Types.EmailRouteFiltersInput>;
  sort?: Types.Maybe<Array<Types.SortInput>>;
}>;


export type RootSiteEmailRoutesAdminTableQueryQuery = (
  { __typename?: 'Query' }
  & { email_routes_paginated: (
    { __typename?: 'EmailRoutesPagination' }
    & Pick<Types.EmailRoutesPagination, 'total_entries' | 'total_pages'>
    & { entries: Array<(
      { __typename?: 'EmailRoute' }
      & Pick<Types.EmailRoute, 'id'>
      & EmailRouteFieldsFragment
    )> }
  ) }
);

export const EmailRouteFieldsFragmentDoc = gql`
    fragment EmailRouteFields on EmailRoute {
  id
  receiver_address
  forward_addresses
}
    `;
export const RootSiteEmailRoutesAdminTableQueryDocument = gql`
    query RootSiteEmailRoutesAdminTableQuery($page: Int, $filters: EmailRouteFiltersInput, $sort: [SortInput!]) {
  email_routes_paginated(page: $page, filters: $filters, sort: $sort) {
    total_entries
    total_pages
    entries {
      id
      ...EmailRouteFields
    }
  }
}
    ${EmailRouteFieldsFragmentDoc}`;

/**
 * __useRootSiteEmailRoutesAdminTableQueryQuery__
 *
 * To run a query within a React component, call `useRootSiteEmailRoutesAdminTableQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useRootSiteEmailRoutesAdminTableQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRootSiteEmailRoutesAdminTableQueryQuery({
 *   variables: {
 *      page: // value for 'page'
 *      filters: // value for 'filters'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useRootSiteEmailRoutesAdminTableQueryQuery(baseOptions?: Apollo.QueryHookOptions<RootSiteEmailRoutesAdminTableQueryQuery, RootSiteEmailRoutesAdminTableQueryQueryVariables>) {
        return Apollo.useQuery<RootSiteEmailRoutesAdminTableQueryQuery, RootSiteEmailRoutesAdminTableQueryQueryVariables>(RootSiteEmailRoutesAdminTableQueryDocument, baseOptions);
      }
export function useRootSiteEmailRoutesAdminTableQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RootSiteEmailRoutesAdminTableQueryQuery, RootSiteEmailRoutesAdminTableQueryQueryVariables>) {
          return Apollo.useLazyQuery<RootSiteEmailRoutesAdminTableQueryQuery, RootSiteEmailRoutesAdminTableQueryQueryVariables>(RootSiteEmailRoutesAdminTableQueryDocument, baseOptions);
        }
export type RootSiteEmailRoutesAdminTableQueryQueryHookResult = ReturnType<typeof useRootSiteEmailRoutesAdminTableQueryQuery>;
export type RootSiteEmailRoutesAdminTableQueryLazyQueryHookResult = ReturnType<typeof useRootSiteEmailRoutesAdminTableQueryLazyQuery>;
export type RootSiteEmailRoutesAdminTableQueryQueryResult = Apollo.QueryResult<RootSiteEmailRoutesAdminTableQueryQuery, RootSiteEmailRoutesAdminTableQueryQueryVariables>;