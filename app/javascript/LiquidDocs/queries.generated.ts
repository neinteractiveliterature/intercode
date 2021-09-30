/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type LiquidAssignFieldsFragment = { __typename: 'LiquidAssign', name: string, drop_class_name: string, cms_variable_value_json?: Types.Maybe<string> };

export type LiquidAssignsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type LiquidAssignsQueryData = { __typename: 'Query', cmsParent: { __typename: 'Convention', liquidAssigns: Array<{ __typename: 'LiquidAssign', name: string, drop_class_name: string, cms_variable_value_json?: Types.Maybe<string> }> } | { __typename: 'RootSite', liquidAssigns: Array<{ __typename: 'LiquidAssign', name: string, drop_class_name: string, cms_variable_value_json?: Types.Maybe<string> }> } };

export type NotifierLiquidAssignsQueryVariables = Types.Exact<{
  eventKey: Types.Scalars['String'];
}>;


export type NotifierLiquidAssignsQueryData = { __typename: 'Query', cmsParent: { __typename: 'Convention', id: number, liquidAssigns: Array<{ __typename: 'LiquidAssign', name: string, drop_class_name: string, cms_variable_value_json?: Types.Maybe<string> }> } };

export const LiquidAssignFieldsFragmentDoc = gql`
    fragment LiquidAssignFields on LiquidAssign {
  name
  drop_class_name
  cms_variable_value_json
}
    `;
export const LiquidAssignsQueryDocument = gql`
    query LiquidAssignsQuery {
  cmsParent: cmsParentByRequestHost {
    liquidAssigns {
      ...LiquidAssignFields
    }
  }
}
    ${LiquidAssignFieldsFragmentDoc}`;

/**
 * __useLiquidAssignsQuery__
 *
 * To run a query within a React component, call `useLiquidAssignsQuery` and pass it any options that fit your needs.
 * When your component renders, `useLiquidAssignsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLiquidAssignsQuery({
 *   variables: {
 *   },
 * });
 */
export function useLiquidAssignsQuery(baseOptions?: Apollo.QueryHookOptions<LiquidAssignsQueryData, LiquidAssignsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LiquidAssignsQueryData, LiquidAssignsQueryVariables>(LiquidAssignsQueryDocument, options);
      }
export function useLiquidAssignsQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LiquidAssignsQueryData, LiquidAssignsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LiquidAssignsQueryData, LiquidAssignsQueryVariables>(LiquidAssignsQueryDocument, options);
        }
export type LiquidAssignsQueryHookResult = ReturnType<typeof useLiquidAssignsQuery>;
export type LiquidAssignsQueryLazyQueryHookResult = ReturnType<typeof useLiquidAssignsQueryLazyQuery>;
export type LiquidAssignsQueryQueryResult = Apollo.QueryResult<LiquidAssignsQueryData, LiquidAssignsQueryVariables>;
export const NotifierLiquidAssignsQueryDocument = gql`
    query NotifierLiquidAssignsQuery($eventKey: String!) {
  cmsParent: conventionByRequestHost {
    id
    liquidAssigns: notifier_liquid_assigns(eventKey: $eventKey) {
      ...LiquidAssignFields
    }
  }
}
    ${LiquidAssignFieldsFragmentDoc}`;

/**
 * __useNotifierLiquidAssignsQuery__
 *
 * To run a query within a React component, call `useNotifierLiquidAssignsQuery` and pass it any options that fit your needs.
 * When your component renders, `useNotifierLiquidAssignsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNotifierLiquidAssignsQuery({
 *   variables: {
 *      eventKey: // value for 'eventKey'
 *   },
 * });
 */
export function useNotifierLiquidAssignsQuery(baseOptions: Apollo.QueryHookOptions<NotifierLiquidAssignsQueryData, NotifierLiquidAssignsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NotifierLiquidAssignsQueryData, NotifierLiquidAssignsQueryVariables>(NotifierLiquidAssignsQueryDocument, options);
      }
export function useNotifierLiquidAssignsQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NotifierLiquidAssignsQueryData, NotifierLiquidAssignsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NotifierLiquidAssignsQueryData, NotifierLiquidAssignsQueryVariables>(NotifierLiquidAssignsQueryDocument, options);
        }
export type NotifierLiquidAssignsQueryHookResult = ReturnType<typeof useNotifierLiquidAssignsQuery>;
export type NotifierLiquidAssignsQueryLazyQueryHookResult = ReturnType<typeof useNotifierLiquidAssignsQueryLazyQuery>;
export type NotifierLiquidAssignsQueryQueryResult = Apollo.QueryResult<NotifierLiquidAssignsQueryData, NotifierLiquidAssignsQueryVariables>;