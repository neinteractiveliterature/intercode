/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CmsGraphqlQueryFieldsFragment = (
  { __typename: 'CmsGraphqlQuery' }
  & Pick<Types.CmsGraphqlQuery, 'id' | 'identifier' | 'query' | 'admin_notes' | 'current_ability_can_update' | 'current_ability_can_delete'>
);

export type CmsGraphqlQueriesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CmsGraphqlQueriesQueryData = (
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
 * __useCmsGraphqlQueriesQuery__
 *
 * To run a query within a React component, call `useCmsGraphqlQueriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCmsGraphqlQueriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCmsGraphqlQueriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useCmsGraphqlQueriesQuery(baseOptions?: Apollo.QueryHookOptions<CmsGraphqlQueriesQueryData, CmsGraphqlQueriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CmsGraphqlQueriesQueryData, CmsGraphqlQueriesQueryVariables>(CmsGraphqlQueriesQueryDocument, options);
      }
export function useCmsGraphqlQueriesQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CmsGraphqlQueriesQueryData, CmsGraphqlQueriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CmsGraphqlQueriesQueryData, CmsGraphqlQueriesQueryVariables>(CmsGraphqlQueriesQueryDocument, options);
        }
export type CmsGraphqlQueriesQueryHookResult = ReturnType<typeof useCmsGraphqlQueriesQuery>;
export type CmsGraphqlQueriesQueryLazyQueryHookResult = ReturnType<typeof useCmsGraphqlQueriesQueryLazyQuery>;
export type CmsGraphqlQueriesQueryDataResult = Apollo.QueryResult<CmsGraphqlQueriesQueryData, CmsGraphqlQueriesQueryVariables>;
