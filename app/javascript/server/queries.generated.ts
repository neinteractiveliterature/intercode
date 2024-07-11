/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetAppLayoutContentQueryVariables = Types.Exact<{
  domain: Types.Scalars['String']['input'];
  path: Types.Scalars['String']['input'];
}>;


export type GetAppLayoutContentQueryData = { __typename: 'Query', cmsParentByDomain: { __typename: 'Convention', id: string, effectiveCmsLayout: { __typename: 'CmsLayout', id: string, app_root_content: string } } | { __typename: 'RootSite', id: string, effectiveCmsLayout: { __typename: 'CmsLayout', id: string, app_root_content: string } } };


export const GetAppLayoutContentDocument = gql`
    query GetAppLayoutContent($domain: String!, $path: String!) {
  cmsParentByDomain(domain: $domain) {
    id
    effectiveCmsLayout(path: $path) {
      id
      app_root_content(path: $path)
    }
  }
}
    `;

/**
 * __useGetAppLayoutContentQuery__
 *
 * To run a query within a React component, call `useGetAppLayoutContentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAppLayoutContentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAppLayoutContentQuery({
 *   variables: {
 *      domain: // value for 'domain'
 *      path: // value for 'path'
 *   },
 * });
 */
export function useGetAppLayoutContentQuery(baseOptions: Apollo.QueryHookOptions<GetAppLayoutContentQueryData, GetAppLayoutContentQueryVariables> & ({ variables: GetAppLayoutContentQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAppLayoutContentQueryData, GetAppLayoutContentQueryVariables>(GetAppLayoutContentDocument, options);
      }
export function useGetAppLayoutContentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAppLayoutContentQueryData, GetAppLayoutContentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAppLayoutContentQueryData, GetAppLayoutContentQueryVariables>(GetAppLayoutContentDocument, options);
        }
export function useGetAppLayoutContentSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAppLayoutContentQueryData, GetAppLayoutContentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAppLayoutContentQueryData, GetAppLayoutContentQueryVariables>(GetAppLayoutContentDocument, options);
        }
export type GetAppLayoutContentQueryHookResult = ReturnType<typeof useGetAppLayoutContentQuery>;
export type GetAppLayoutContentLazyQueryHookResult = ReturnType<typeof useGetAppLayoutContentLazyQuery>;
export type GetAppLayoutContentSuspenseQueryHookResult = ReturnType<typeof useGetAppLayoutContentSuspenseQuery>;
export type GetAppLayoutContentQueryResult = Apollo.QueryResult<GetAppLayoutContentQueryData, GetAppLayoutContentQueryVariables>;