/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type EmailRouteFieldsFragment = { __typename: 'EmailRoute', id: number, receiver_address: string, forward_addresses?: Array<string> | null | undefined };

export type RootSiteEmailRoutesAdminTableQueryVariables = Types.Exact<{
  page?: Types.Maybe<Types.Scalars['Int']>;
  filters?: Types.Maybe<Types.EmailRouteFiltersInput>;
  sort?: Types.Maybe<Array<Types.SortInput> | Types.SortInput>;
}>;


export type RootSiteEmailRoutesAdminTableQueryData = { __typename: 'Query', email_routes_paginated: { __typename: 'EmailRoutesPagination', total_entries: number, total_pages: number, entries: Array<{ __typename: 'EmailRoute', id: number, receiver_address: string, forward_addresses?: Array<string> | null | undefined }> } };

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
 * __useRootSiteEmailRoutesAdminTableQuery__
 *
 * To run a query within a React component, call `useRootSiteEmailRoutesAdminTableQuery` and pass it any options that fit your needs.
 * When your component renders, `useRootSiteEmailRoutesAdminTableQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRootSiteEmailRoutesAdminTableQuery({
 *   variables: {
 *      page: // value for 'page'
 *      filters: // value for 'filters'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useRootSiteEmailRoutesAdminTableQuery(baseOptions?: Apollo.QueryHookOptions<RootSiteEmailRoutesAdminTableQueryData, RootSiteEmailRoutesAdminTableQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RootSiteEmailRoutesAdminTableQueryData, RootSiteEmailRoutesAdminTableQueryVariables>(RootSiteEmailRoutesAdminTableQueryDocument, options);
      }
export function useRootSiteEmailRoutesAdminTableQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RootSiteEmailRoutesAdminTableQueryData, RootSiteEmailRoutesAdminTableQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RootSiteEmailRoutesAdminTableQueryData, RootSiteEmailRoutesAdminTableQueryVariables>(RootSiteEmailRoutesAdminTableQueryDocument, options);
        }
export type RootSiteEmailRoutesAdminTableQueryHookResult = ReturnType<typeof useRootSiteEmailRoutesAdminTableQuery>;
export type RootSiteEmailRoutesAdminTableQueryLazyQueryHookResult = ReturnType<typeof useRootSiteEmailRoutesAdminTableQueryLazyQuery>;
export type RootSiteEmailRoutesAdminTableQueryQueryResult = Apollo.QueryResult<RootSiteEmailRoutesAdminTableQueryData, RootSiteEmailRoutesAdminTableQueryVariables>;