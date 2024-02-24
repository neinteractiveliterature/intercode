/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type SiteSearchQueryVariables = Types.Exact<{
  query: Types.Scalars['String']['input'];
}>;


export type SiteSearchQueryData = { __typename: 'Query', cmsParent: { __typename: 'Convention', id: string, fullTextSearch: { __typename: 'SearchResult', total_entries: number, entries: Array<{ __typename: 'SearchResultEntry', title?: string | null, highlight?: string | null, model: { __typename: 'Event', id: string, title?: string | null } | { __typename: 'EventProposal', id: string, title?: string | null } | { __typename: 'Page', id: string, slug?: string | null } | { __typename: 'UserConProfile', id: string } }> } } | { __typename: 'RootSite', id: string, fullTextSearch: { __typename: 'SearchResult', total_entries: number, entries: Array<{ __typename: 'SearchResultEntry', title?: string | null, highlight?: string | null, model: { __typename: 'Event', id: string, title?: string | null } | { __typename: 'EventProposal', id: string, title?: string | null } | { __typename: 'Page', id: string, slug?: string | null } | { __typename: 'UserConProfile', id: string } }> } } };


export const SiteSearchQueryDocument = gql`
    query SiteSearchQuery($query: String!) {
  cmsParent: cmsParentByRequestHost {
    id
    fullTextSearch(query: $query) {
      total_entries
      entries {
        title
        highlight
        model {
          __typename
          ... on Page {
            id
            slug
          }
          ... on Event {
            id
            title
          }
          ... on EventProposal {
            id
            title
          }
          ... on UserConProfile {
            id
          }
        }
      }
    }
  }
}
    `;

/**
 * __useSiteSearchQuery__
 *
 * To run a query within a React component, call `useSiteSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useSiteSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSiteSearchQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useSiteSearchQuery(baseOptions: Apollo.QueryHookOptions<SiteSearchQueryData, SiteSearchQueryVariables> & ({ variables: SiteSearchQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SiteSearchQueryData, SiteSearchQueryVariables>(SiteSearchQueryDocument, options);
      }
export function useSiteSearchQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SiteSearchQueryData, SiteSearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SiteSearchQueryData, SiteSearchQueryVariables>(SiteSearchQueryDocument, options);
        }
export function useSiteSearchQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<SiteSearchQueryData, SiteSearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SiteSearchQueryData, SiteSearchQueryVariables>(SiteSearchQueryDocument, options);
        }
export type SiteSearchQueryHookResult = ReturnType<typeof useSiteSearchQuery>;
export type SiteSearchQueryLazyQueryHookResult = ReturnType<typeof useSiteSearchQueryLazyQuery>;
export type SiteSearchQuerySuspenseQueryHookResult = ReturnType<typeof useSiteSearchQuerySuspenseQuery>;
export type SiteSearchQueryQueryResult = Apollo.QueryResult<SiteSearchQueryData, SiteSearchQueryVariables>;