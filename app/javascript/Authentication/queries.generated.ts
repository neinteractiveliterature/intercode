/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type AccountFormContentQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type AccountFormContentQueryData = { __typename: 'Query', accountFormContentHtml?: string | null | undefined };

export type EditUserQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type EditUserQueryData = { __typename: 'Query', convention?: { __typename: 'Convention', id: number, name: string } | null | undefined, currentUser?: { __typename: 'User', id: number, first_name?: string | null | undefined, last_name?: string | null | undefined, email?: string | null | undefined } | null | undefined };


export const AccountFormContentQueryDocument = gql`
    query AccountFormContentQuery {
  accountFormContentHtml
}
    `;

/**
 * __useAccountFormContentQuery__
 *
 * To run a query within a React component, call `useAccountFormContentQuery` and pass it any options that fit your needs.
 * When your component renders, `useAccountFormContentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAccountFormContentQuery({
 *   variables: {
 *   },
 * });
 */
export function useAccountFormContentQuery(baseOptions?: Apollo.QueryHookOptions<AccountFormContentQueryData, AccountFormContentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AccountFormContentQueryData, AccountFormContentQueryVariables>(AccountFormContentQueryDocument, options);
      }
export function useAccountFormContentQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AccountFormContentQueryData, AccountFormContentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AccountFormContentQueryData, AccountFormContentQueryVariables>(AccountFormContentQueryDocument, options);
        }
export type AccountFormContentQueryHookResult = ReturnType<typeof useAccountFormContentQuery>;
export type AccountFormContentQueryLazyQueryHookResult = ReturnType<typeof useAccountFormContentQueryLazyQuery>;
export type AccountFormContentQueryQueryResult = Apollo.QueryResult<AccountFormContentQueryData, AccountFormContentQueryVariables>;
export const EditUserQueryDocument = gql`
    query EditUserQuery {
  convention: conventionByRequestHostIfPresent {
    id
    name
  }
  currentUser {
    id
    first_name
    last_name
    email
  }
}
    `;

/**
 * __useEditUserQuery__
 *
 * To run a query within a React component, call `useEditUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useEditUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEditUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useEditUserQuery(baseOptions?: Apollo.QueryHookOptions<EditUserQueryData, EditUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EditUserQueryData, EditUserQueryVariables>(EditUserQueryDocument, options);
      }
export function useEditUserQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EditUserQueryData, EditUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EditUserQueryData, EditUserQueryVariables>(EditUserQueryDocument, options);
        }
export type EditUserQueryHookResult = ReturnType<typeof useEditUserQuery>;
export type EditUserQueryLazyQueryHookResult = ReturnType<typeof useEditUserQueryLazyQuery>;
export type EditUserQueryQueryResult = Apollo.QueryResult<EditUserQueryData, EditUserQueryVariables>;