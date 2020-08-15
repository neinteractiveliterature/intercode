/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';


export type CmsAdminBaseQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CmsAdminBaseQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id'>
  )>, currentAbility: (
    { __typename?: 'Ability' }
    & Pick<Types.Ability, 'can_create_cms_navigation_items'>
  ) }
);


export const CmsAdminBaseQueryDocument = gql`
    query CmsAdminBaseQuery {
  convention {
    id
  }
  currentAbility {
    can_create_cms_navigation_items
  }
}
    `;

/**
 * __useCmsAdminBaseQueryQuery__
 *
 * To run a query within a React component, call `useCmsAdminBaseQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useCmsAdminBaseQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCmsAdminBaseQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useCmsAdminBaseQueryQuery(baseOptions?: Apollo.QueryHookOptions<CmsAdminBaseQueryQuery, CmsAdminBaseQueryQueryVariables>) {
        return Apollo.useQuery<CmsAdminBaseQueryQuery, CmsAdminBaseQueryQueryVariables>(CmsAdminBaseQueryDocument, baseOptions);
      }
export function useCmsAdminBaseQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CmsAdminBaseQueryQuery, CmsAdminBaseQueryQueryVariables>) {
          return Apollo.useLazyQuery<CmsAdminBaseQueryQuery, CmsAdminBaseQueryQueryVariables>(CmsAdminBaseQueryDocument, baseOptions);
        }
export type CmsAdminBaseQueryQueryHookResult = ReturnType<typeof useCmsAdminBaseQueryQuery>;
export type CmsAdminBaseQueryLazyQueryHookResult = ReturnType<typeof useCmsAdminBaseQueryLazyQuery>;
export type CmsAdminBaseQueryQueryResult = Apollo.QueryResult<CmsAdminBaseQueryQuery, CmsAdminBaseQueryQueryVariables>;