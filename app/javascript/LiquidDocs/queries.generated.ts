/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type LiquidAssignFieldsFragment = (
  { __typename: 'LiquidAssign' }
  & Pick<Types.LiquidAssign, 'name' | 'drop_class_name' | 'cms_variable_value_json'>
);

export type LiquidAssignsQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type LiquidAssignsQueryQuery = (
  { __typename: 'Query' }
  & { liquidAssigns: Array<(
    { __typename: 'LiquidAssign' }
    & LiquidAssignFieldsFragment
  )> }
);

export type NotifierLiquidAssignsQueryQueryVariables = Types.Exact<{
  eventKey: Types.Scalars['String'];
}>;


export type NotifierLiquidAssignsQueryQuery = (
  { __typename: 'Query' }
  & { liquidAssigns: Array<(
    { __typename: 'LiquidAssign' }
    & LiquidAssignFieldsFragment
  )> }
);

export const LiquidAssignFieldsFragmentDoc = gql`
    fragment LiquidAssignFields on LiquidAssign {
  name
  drop_class_name
  cms_variable_value_json
}
    `;
export const LiquidAssignsQueryDocument = gql`
    query LiquidAssignsQuery {
  liquidAssigns {
    ...LiquidAssignFields
  }
}
    ${LiquidAssignFieldsFragmentDoc}`;

/**
 * __useLiquidAssignsQueryQuery__
 *
 * To run a query within a React component, call `useLiquidAssignsQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useLiquidAssignsQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLiquidAssignsQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useLiquidAssignsQueryQuery(baseOptions?: Apollo.QueryHookOptions<LiquidAssignsQueryQuery, LiquidAssignsQueryQueryVariables>) {
        return Apollo.useQuery<LiquidAssignsQueryQuery, LiquidAssignsQueryQueryVariables>(LiquidAssignsQueryDocument, baseOptions);
      }
export function useLiquidAssignsQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LiquidAssignsQueryQuery, LiquidAssignsQueryQueryVariables>) {
          return Apollo.useLazyQuery<LiquidAssignsQueryQuery, LiquidAssignsQueryQueryVariables>(LiquidAssignsQueryDocument, baseOptions);
        }
export type LiquidAssignsQueryQueryHookResult = ReturnType<typeof useLiquidAssignsQueryQuery>;
export type LiquidAssignsQueryLazyQueryHookResult = ReturnType<typeof useLiquidAssignsQueryLazyQuery>;
export type LiquidAssignsQueryQueryResult = Apollo.QueryResult<LiquidAssignsQueryQuery, LiquidAssignsQueryQueryVariables>;
export const NotifierLiquidAssignsQueryDocument = gql`
    query NotifierLiquidAssignsQuery($eventKey: String!) {
  liquidAssigns: notifierLiquidAssigns(eventKey: $eventKey) {
    ...LiquidAssignFields
  }
}
    ${LiquidAssignFieldsFragmentDoc}`;

/**
 * __useNotifierLiquidAssignsQueryQuery__
 *
 * To run a query within a React component, call `useNotifierLiquidAssignsQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useNotifierLiquidAssignsQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNotifierLiquidAssignsQueryQuery({
 *   variables: {
 *      eventKey: // value for 'eventKey'
 *   },
 * });
 */
export function useNotifierLiquidAssignsQueryQuery(baseOptions: Apollo.QueryHookOptions<NotifierLiquidAssignsQueryQuery, NotifierLiquidAssignsQueryQueryVariables>) {
        return Apollo.useQuery<NotifierLiquidAssignsQueryQuery, NotifierLiquidAssignsQueryQueryVariables>(NotifierLiquidAssignsQueryDocument, baseOptions);
      }
export function useNotifierLiquidAssignsQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NotifierLiquidAssignsQueryQuery, NotifierLiquidAssignsQueryQueryVariables>) {
          return Apollo.useLazyQuery<NotifierLiquidAssignsQueryQuery, NotifierLiquidAssignsQueryQueryVariables>(NotifierLiquidAssignsQueryDocument, baseOptions);
        }
export type NotifierLiquidAssignsQueryQueryHookResult = ReturnType<typeof useNotifierLiquidAssignsQueryQuery>;
export type NotifierLiquidAssignsQueryLazyQueryHookResult = ReturnType<typeof useNotifierLiquidAssignsQueryLazyQuery>;
export type NotifierLiquidAssignsQueryQueryResult = Apollo.QueryResult<NotifierLiquidAssignsQueryQuery, NotifierLiquidAssignsQueryQueryVariables>;