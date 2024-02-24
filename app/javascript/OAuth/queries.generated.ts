/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type OAuthAuthorizationPromptQueryVariables = Types.Exact<{
  queryParams: Types.Scalars['Json']['input'];
}>;


export type OAuthAuthorizationPromptQueryData = { __typename: 'Query', oauthPreAuth: string, currentUser?: { __typename: 'User', id: string } | null };

export type OAuthAuthorizedApplicationsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type OAuthAuthorizedApplicationsQueryData = { __typename: 'Query', myAuthorizedApplications: Array<{ __typename: 'AuthorizedApplication', uid: string, name: string, scopes: Array<string> }> };


export const OAuthAuthorizationPromptQueryDocument = gql`
    query OAuthAuthorizationPromptQuery($queryParams: Json!) {
  currentUser {
    id
  }
  oauthPreAuth(queryParams: $queryParams)
}
    `;

/**
 * __useOAuthAuthorizationPromptQuery__
 *
 * To run a query within a React component, call `useOAuthAuthorizationPromptQuery` and pass it any options that fit your needs.
 * When your component renders, `useOAuthAuthorizationPromptQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOAuthAuthorizationPromptQuery({
 *   variables: {
 *      queryParams: // value for 'queryParams'
 *   },
 * });
 */
export function useOAuthAuthorizationPromptQuery(baseOptions: Apollo.QueryHookOptions<OAuthAuthorizationPromptQueryData, OAuthAuthorizationPromptQueryVariables> & ({ variables: OAuthAuthorizationPromptQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OAuthAuthorizationPromptQueryData, OAuthAuthorizationPromptQueryVariables>(OAuthAuthorizationPromptQueryDocument, options);
      }
export function useOAuthAuthorizationPromptQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OAuthAuthorizationPromptQueryData, OAuthAuthorizationPromptQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OAuthAuthorizationPromptQueryData, OAuthAuthorizationPromptQueryVariables>(OAuthAuthorizationPromptQueryDocument, options);
        }
export function useOAuthAuthorizationPromptQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<OAuthAuthorizationPromptQueryData, OAuthAuthorizationPromptQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<OAuthAuthorizationPromptQueryData, OAuthAuthorizationPromptQueryVariables>(OAuthAuthorizationPromptQueryDocument, options);
        }
export type OAuthAuthorizationPromptQueryHookResult = ReturnType<typeof useOAuthAuthorizationPromptQuery>;
export type OAuthAuthorizationPromptQueryLazyQueryHookResult = ReturnType<typeof useOAuthAuthorizationPromptQueryLazyQuery>;
export type OAuthAuthorizationPromptQuerySuspenseQueryHookResult = ReturnType<typeof useOAuthAuthorizationPromptQuerySuspenseQuery>;
export type OAuthAuthorizationPromptQueryQueryResult = Apollo.QueryResult<OAuthAuthorizationPromptQueryData, OAuthAuthorizationPromptQueryVariables>;
export const OAuthAuthorizedApplicationsQueryDocument = gql`
    query OAuthAuthorizedApplicationsQuery {
  myAuthorizedApplications {
    uid
    name
    scopes
  }
}
    `;

/**
 * __useOAuthAuthorizedApplicationsQuery__
 *
 * To run a query within a React component, call `useOAuthAuthorizedApplicationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useOAuthAuthorizedApplicationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOAuthAuthorizedApplicationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useOAuthAuthorizedApplicationsQuery(baseOptions?: Apollo.QueryHookOptions<OAuthAuthorizedApplicationsQueryData, OAuthAuthorizedApplicationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OAuthAuthorizedApplicationsQueryData, OAuthAuthorizedApplicationsQueryVariables>(OAuthAuthorizedApplicationsQueryDocument, options);
      }
export function useOAuthAuthorizedApplicationsQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OAuthAuthorizedApplicationsQueryData, OAuthAuthorizedApplicationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OAuthAuthorizedApplicationsQueryData, OAuthAuthorizedApplicationsQueryVariables>(OAuthAuthorizedApplicationsQueryDocument, options);
        }
export function useOAuthAuthorizedApplicationsQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<OAuthAuthorizedApplicationsQueryData, OAuthAuthorizedApplicationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<OAuthAuthorizedApplicationsQueryData, OAuthAuthorizedApplicationsQueryVariables>(OAuthAuthorizedApplicationsQueryDocument, options);
        }
export type OAuthAuthorizedApplicationsQueryHookResult = ReturnType<typeof useOAuthAuthorizedApplicationsQuery>;
export type OAuthAuthorizedApplicationsQueryLazyQueryHookResult = ReturnType<typeof useOAuthAuthorizedApplicationsQueryLazyQuery>;
export type OAuthAuthorizedApplicationsQuerySuspenseQueryHookResult = ReturnType<typeof useOAuthAuthorizedApplicationsQuerySuspenseQuery>;
export type OAuthAuthorizedApplicationsQueryQueryResult = Apollo.QueryResult<OAuthAuthorizedApplicationsQueryData, OAuthAuthorizedApplicationsQueryVariables>;