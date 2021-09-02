/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type RoomsAdminQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type RoomsAdminQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: number, rooms: Array<{ __typename: 'Room', id: number, name?: Types.Maybe<string>, runs: Array<{ __typename: 'Run', id: number }> }> } };


export const RoomsAdminQueryDocument = gql`
    query RoomsAdminQuery {
  convention: assertConvention {
    id
    rooms {
      id
      name
      runs {
        id
      }
    }
  }
}
    `;

/**
 * __useRoomsAdminQuery__
 *
 * To run a query within a React component, call `useRoomsAdminQuery` and pass it any options that fit your needs.
 * When your component renders, `useRoomsAdminQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRoomsAdminQuery({
 *   variables: {
 *   },
 * });
 */
export function useRoomsAdminQuery(baseOptions?: Apollo.QueryHookOptions<RoomsAdminQueryData, RoomsAdminQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RoomsAdminQueryData, RoomsAdminQueryVariables>(RoomsAdminQueryDocument, options);
      }
export function useRoomsAdminQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RoomsAdminQueryData, RoomsAdminQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RoomsAdminQueryData, RoomsAdminQueryVariables>(RoomsAdminQueryDocument, options);
        }
export type RoomsAdminQueryHookResult = ReturnType<typeof useRoomsAdminQuery>;
export type RoomsAdminQueryLazyQueryHookResult = ReturnType<typeof useRoomsAdminQueryLazyQuery>;
export type RoomsAdminQueryQueryResult = Apollo.QueryResult<RoomsAdminQueryData, RoomsAdminQueryVariables>;