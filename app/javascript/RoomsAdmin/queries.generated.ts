/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type RoomsAdminQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type RoomsAdminQueryQuery = (
  { __typename: 'Query' }
  & { convention: (
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & { rooms: Array<(
      { __typename: 'Room' }
      & Pick<Types.Room, 'id' | 'name'>
      & { runs: Array<(
        { __typename: 'Run' }
        & Pick<Types.Run, 'id'>
      )> }
    )> }
  ) }
);


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
 * __useRoomsAdminQueryQuery__
 *
 * To run a query within a React component, call `useRoomsAdminQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useRoomsAdminQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRoomsAdminQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useRoomsAdminQueryQuery(baseOptions?: Apollo.QueryHookOptions<RoomsAdminQueryQuery, RoomsAdminQueryQueryVariables>) {
        return Apollo.useQuery<RoomsAdminQueryQuery, RoomsAdminQueryQueryVariables>(RoomsAdminQueryDocument, baseOptions);
      }
export function useRoomsAdminQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RoomsAdminQueryQuery, RoomsAdminQueryQueryVariables>) {
          return Apollo.useLazyQuery<RoomsAdminQueryQuery, RoomsAdminQueryQueryVariables>(RoomsAdminQueryDocument, baseOptions);
        }
export type RoomsAdminQueryQueryHookResult = ReturnType<typeof useRoomsAdminQueryQuery>;
export type RoomsAdminQueryLazyQueryHookResult = ReturnType<typeof useRoomsAdminQueryLazyQuery>;
export type RoomsAdminQueryQueryResult = Apollo.QueryResult<RoomsAdminQueryQuery, RoomsAdminQueryQueryVariables>;