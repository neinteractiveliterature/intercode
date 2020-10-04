/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type AccountFormContentQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type AccountFormContentQueryQuery = (
  { __typename: 'Query' }
  & Pick<Types.Query, 'accountFormContentHtml'>
);

export type EditUserQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type EditUserQueryQuery = (
  { __typename: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'name'>
  )>, currentUser?: Types.Maybe<(
    { __typename: 'User' }
    & Pick<Types.User, 'id' | 'first_name' | 'last_name' | 'email'>
  )> }
);


export const AccountFormContentQueryDocument = gql`
    query AccountFormContentQuery {
  accountFormContentHtml
}
    `;

/**
 * __useAccountFormContentQueryQuery__
 *
 * To run a query within a React component, call `useAccountFormContentQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useAccountFormContentQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAccountFormContentQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useAccountFormContentQueryQuery(baseOptions?: Apollo.QueryHookOptions<AccountFormContentQueryQuery, AccountFormContentQueryQueryVariables>) {
        return Apollo.useQuery<AccountFormContentQueryQuery, AccountFormContentQueryQueryVariables>(AccountFormContentQueryDocument, baseOptions);
      }
export function useAccountFormContentQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AccountFormContentQueryQuery, AccountFormContentQueryQueryVariables>) {
          return Apollo.useLazyQuery<AccountFormContentQueryQuery, AccountFormContentQueryQueryVariables>(AccountFormContentQueryDocument, baseOptions);
        }
export type AccountFormContentQueryQueryHookResult = ReturnType<typeof useAccountFormContentQueryQuery>;
export type AccountFormContentQueryLazyQueryHookResult = ReturnType<typeof useAccountFormContentQueryLazyQuery>;
export type AccountFormContentQueryQueryResult = Apollo.QueryResult<AccountFormContentQueryQuery, AccountFormContentQueryQueryVariables>;
export const EditUserQueryDocument = gql`
    query EditUserQuery {
  convention {
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
 * __useEditUserQueryQuery__
 *
 * To run a query within a React component, call `useEditUserQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useEditUserQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEditUserQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useEditUserQueryQuery(baseOptions?: Apollo.QueryHookOptions<EditUserQueryQuery, EditUserQueryQueryVariables>) {
        return Apollo.useQuery<EditUserQueryQuery, EditUserQueryQueryVariables>(EditUserQueryDocument, baseOptions);
      }
export function useEditUserQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EditUserQueryQuery, EditUserQueryQueryVariables>) {
          return Apollo.useLazyQuery<EditUserQueryQuery, EditUserQueryQueryVariables>(EditUserQueryDocument, baseOptions);
        }
export type EditUserQueryQueryHookResult = ReturnType<typeof useEditUserQueryQuery>;
export type EditUserQueryLazyQueryHookResult = ReturnType<typeof useEditUserQueryLazyQuery>;
export type EditUserQueryQueryResult = Apollo.QueryResult<EditUserQueryQuery, EditUserQueryQueryVariables>;