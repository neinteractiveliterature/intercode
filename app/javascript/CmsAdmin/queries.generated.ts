/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CmsAdminBaseQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CmsAdminBaseQueryData = (
  { __typename: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id'>
  )>, currentAbility: (
    { __typename: 'Ability' }
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
 * __useCmsAdminBaseQuery__
 *
 * To run a query within a React component, call `useCmsAdminBaseQuery` and pass it any options that fit your needs.
 * When your component renders, `useCmsAdminBaseQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCmsAdminBaseQuery({
 *   variables: {
 *   },
 * });
 */
export function useCmsAdminBaseQuery(baseOptions?: Apollo.QueryHookOptions<CmsAdminBaseQueryData, CmsAdminBaseQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CmsAdminBaseQueryData, CmsAdminBaseQueryVariables>(CmsAdminBaseQueryDocument, options);
      }
export function useCmsAdminBaseQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CmsAdminBaseQueryData, CmsAdminBaseQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CmsAdminBaseQueryData, CmsAdminBaseQueryVariables>(CmsAdminBaseQueryDocument, options);
        }
export type CmsAdminBaseQueryHookResult = ReturnType<typeof useCmsAdminBaseQuery>;
export type CmsAdminBaseQueryLazyQueryHookResult = ReturnType<typeof useCmsAdminBaseQueryLazyQuery>;
export type CmsAdminBaseQueryQueryResult = Apollo.QueryResult<CmsAdminBaseQueryData, CmsAdminBaseQueryVariables>;