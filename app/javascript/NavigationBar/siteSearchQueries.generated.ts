/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type SiteSearchQueryQueryVariables = Types.Exact<{
  query: Types.Scalars['String'];
}>;


export type SiteSearchQueryQuery = (
  { __typename?: 'Query' }
  & { siteSearch: (
    { __typename?: 'SearchResult' }
    & Pick<Types.SearchResult, 'total_entries'>
    & { entries: Array<(
      { __typename?: 'SearchResultEntry' }
      & Pick<Types.SearchResultEntry, 'title' | 'highlight'>
      & { model: (
        { __typename: 'Event' }
        & Pick<Types.Event, 'id' | 'title'>
      ) | (
        { __typename: 'EventProposal' }
        & Pick<Types.EventProposal, 'id' | 'title'>
      ) | (
        { __typename: 'Page' }
        & Pick<Types.Page, 'id' | 'slug'>
      ) | (
        { __typename: 'UserConProfile' }
        & Pick<Types.UserConProfile, 'id'>
      ) }
    )> }
  ) }
);


export const SiteSearchQueryDocument = gql`
    query SiteSearchQuery($query: String!) {
  siteSearch(query: $query) {
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
    `;

/**
 * __useSiteSearchQueryQuery__
 *
 * To run a query within a React component, call `useSiteSearchQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useSiteSearchQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSiteSearchQueryQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useSiteSearchQueryQuery(baseOptions?: Apollo.QueryHookOptions<SiteSearchQueryQuery, SiteSearchQueryQueryVariables>) {
        return Apollo.useQuery<SiteSearchQueryQuery, SiteSearchQueryQueryVariables>(SiteSearchQueryDocument, baseOptions);
      }
export function useSiteSearchQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SiteSearchQueryQuery, SiteSearchQueryQueryVariables>) {
          return Apollo.useLazyQuery<SiteSearchQueryQuery, SiteSearchQueryQueryVariables>(SiteSearchQueryDocument, baseOptions);
        }
export type SiteSearchQueryQueryHookResult = ReturnType<typeof useSiteSearchQueryQuery>;
export type SiteSearchQueryLazyQueryHookResult = ReturnType<typeof useSiteSearchQueryLazyQuery>;
export type SiteSearchQueryQueryResult = Apollo.QueryResult<SiteSearchQueryQuery, SiteSearchQueryQueryVariables>;