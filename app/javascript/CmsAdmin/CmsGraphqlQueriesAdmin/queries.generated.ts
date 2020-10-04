/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type CmsGraphqlQueryFieldsFragment = (
  { __typename: 'CmsGraphqlQuery' }
  & Pick<Types.CmsGraphqlQuery, 'id' | 'identifier' | 'query' | 'admin_notes' | 'current_ability_can_update' | 'current_ability_can_delete'>
);

export type CmsGraphqlQueriesQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CmsGraphqlQueriesQueryQuery = (
  { __typename: 'Query' }
  & { cmsGraphqlQueries: Array<(
    { __typename: 'CmsGraphqlQuery' }
    & Pick<Types.CmsGraphqlQuery, 'id'>
    & CmsGraphqlQueryFieldsFragment
  )>, currentAbility: (
    { __typename: 'Ability' }
    & Pick<Types.Ability, 'can_create_cms_graphql_queries'>
  ) }
);

export const CmsGraphqlQueryFieldsFragmentDoc = gql`
    fragment CmsGraphqlQueryFields on CmsGraphqlQuery {
  id
  identifier
  query
  admin_notes
  current_ability_can_update
  current_ability_can_delete
}
    `;
export const CmsGraphqlQueriesQueryDocument = gql`
    query CmsGraphqlQueriesQuery {
  cmsGraphqlQueries {
    id
    ...CmsGraphqlQueryFields
  }
  currentAbility {
    can_create_cms_graphql_queries
  }
}
    ${CmsGraphqlQueryFieldsFragmentDoc}`;

/**
 * __useCmsGraphqlQueriesQueryQuery__
 *
 * To run a query within a React component, call `useCmsGraphqlQueriesQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useCmsGraphqlQueriesQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCmsGraphqlQueriesQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useCmsGraphqlQueriesQueryQuery(baseOptions?: Apollo.QueryHookOptions<CmsGraphqlQueriesQueryQuery, CmsGraphqlQueriesQueryQueryVariables>) {
        return Apollo.useQuery<CmsGraphqlQueriesQueryQuery, CmsGraphqlQueriesQueryQueryVariables>(CmsGraphqlQueriesQueryDocument, baseOptions);
      }
export function useCmsGraphqlQueriesQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CmsGraphqlQueriesQueryQuery, CmsGraphqlQueriesQueryQueryVariables>) {
          return Apollo.useLazyQuery<CmsGraphqlQueriesQueryQuery, CmsGraphqlQueriesQueryQueryVariables>(CmsGraphqlQueriesQueryDocument, baseOptions);
        }
export type CmsGraphqlQueriesQueryQueryHookResult = ReturnType<typeof useCmsGraphqlQueriesQueryQuery>;
export type CmsGraphqlQueriesQueryLazyQueryHookResult = ReturnType<typeof useCmsGraphqlQueriesQueryLazyQuery>;
export type CmsGraphqlQueriesQueryQueryResult = Apollo.QueryResult<CmsGraphqlQueriesQueryQuery, CmsGraphqlQueriesQueryQueryVariables>;