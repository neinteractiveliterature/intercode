/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';


export type OAuthAuthorizationPromptQueryQueryVariables = Types.Exact<{
  queryParams: Types.Scalars['Json'];
}>;


export type OAuthAuthorizationPromptQueryQuery = (
  { __typename?: 'Query' }
  & Pick<Types.Query, 'oauthPreAuth'>
  & { currentUser?: Types.Maybe<(
    { __typename?: 'User' }
    & Pick<Types.User, 'id'>
  )> }
);

export type OAuthAuthorizedApplicationsQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type OAuthAuthorizedApplicationsQueryQuery = (
  { __typename?: 'Query' }
  & { myAuthorizedApplications: Array<(
    { __typename?: 'AuthorizedApplication' }
    & Pick<Types.AuthorizedApplication, 'uid' | 'name' | 'scopes'>
  )> }
);


export const OAuthAuthorizationPromptQueryDocument = gql`
    query OAuthAuthorizationPromptQuery($queryParams: Json!) {
  currentUser {
    id
  }
  oauthPreAuth(queryParams: $queryParams)
}
    `;

/**
 * __useOAuthAuthorizationPromptQueryQuery__
 *
 * To run a query within a React component, call `useOAuthAuthorizationPromptQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useOAuthAuthorizationPromptQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOAuthAuthorizationPromptQueryQuery({
 *   variables: {
 *      queryParams: // value for 'queryParams'
 *   },
 * });
 */
export function useOAuthAuthorizationPromptQueryQuery(baseOptions?: Apollo.QueryHookOptions<OAuthAuthorizationPromptQueryQuery, OAuthAuthorizationPromptQueryQueryVariables>) {
        return Apollo.useQuery<OAuthAuthorizationPromptQueryQuery, OAuthAuthorizationPromptQueryQueryVariables>(OAuthAuthorizationPromptQueryDocument, baseOptions);
      }
export function useOAuthAuthorizationPromptQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OAuthAuthorizationPromptQueryQuery, OAuthAuthorizationPromptQueryQueryVariables>) {
          return Apollo.useLazyQuery<OAuthAuthorizationPromptQueryQuery, OAuthAuthorizationPromptQueryQueryVariables>(OAuthAuthorizationPromptQueryDocument, baseOptions);
        }
export type OAuthAuthorizationPromptQueryQueryHookResult = ReturnType<typeof useOAuthAuthorizationPromptQueryQuery>;
export type OAuthAuthorizationPromptQueryLazyQueryHookResult = ReturnType<typeof useOAuthAuthorizationPromptQueryLazyQuery>;
export type OAuthAuthorizationPromptQueryQueryResult = Apollo.QueryResult<OAuthAuthorizationPromptQueryQuery, OAuthAuthorizationPromptQueryQueryVariables>;
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
 * __useOAuthAuthorizedApplicationsQueryQuery__
 *
 * To run a query within a React component, call `useOAuthAuthorizedApplicationsQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useOAuthAuthorizedApplicationsQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOAuthAuthorizedApplicationsQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useOAuthAuthorizedApplicationsQueryQuery(baseOptions?: Apollo.QueryHookOptions<OAuthAuthorizedApplicationsQueryQuery, OAuthAuthorizedApplicationsQueryQueryVariables>) {
        return Apollo.useQuery<OAuthAuthorizedApplicationsQueryQuery, OAuthAuthorizedApplicationsQueryQueryVariables>(OAuthAuthorizedApplicationsQueryDocument, baseOptions);
      }
export function useOAuthAuthorizedApplicationsQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OAuthAuthorizedApplicationsQueryQuery, OAuthAuthorizedApplicationsQueryQueryVariables>) {
          return Apollo.useLazyQuery<OAuthAuthorizedApplicationsQueryQuery, OAuthAuthorizedApplicationsQueryQueryVariables>(OAuthAuthorizedApplicationsQueryDocument, baseOptions);
        }
export type OAuthAuthorizedApplicationsQueryQueryHookResult = ReturnType<typeof useOAuthAuthorizedApplicationsQueryQuery>;
export type OAuthAuthorizedApplicationsQueryLazyQueryHookResult = ReturnType<typeof useOAuthAuthorizedApplicationsQueryLazyQuery>;
export type OAuthAuthorizedApplicationsQueryQueryResult = Apollo.QueryResult<OAuthAuthorizedApplicationsQueryQuery, OAuthAuthorizedApplicationsQueryQueryVariables>;