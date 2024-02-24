/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type LiquidAssignFieldsFragment = { __typename: 'LiquidAssign', name: string, drop_class_name: string, cms_variable_value_json?: string | null };

export type LiquidAssignsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type LiquidAssignsQueryData = { __typename: 'Query', cmsParent: { __typename: 'Convention', id: string, liquidAssigns: Array<{ __typename: 'LiquidAssign', name: string, drop_class_name: string, cms_variable_value_json?: string | null }> } | { __typename: 'RootSite', id: string, liquidAssigns: Array<{ __typename: 'LiquidAssign', name: string, drop_class_name: string, cms_variable_value_json?: string | null }> } };

export type NotifierLiquidAssignsQueryVariables = Types.Exact<{
  eventKey: Types.Scalars['String']['input'];
}>;


export type NotifierLiquidAssignsQueryData = { __typename: 'Query', cmsParent: { __typename: 'Convention', id: string, liquidAssigns: Array<{ __typename: 'LiquidAssign', name: string, drop_class_name: string, cms_variable_value_json?: string | null }> } };

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
    id
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
export function useLiquidAssignsQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<LiquidAssignsQueryData, LiquidAssignsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<LiquidAssignsQueryData, LiquidAssignsQueryVariables>(LiquidAssignsQueryDocument, options);
        }
export type LiquidAssignsQueryHookResult = ReturnType<typeof useLiquidAssignsQuery>;
export type LiquidAssignsQueryLazyQueryHookResult = ReturnType<typeof useLiquidAssignsQueryLazyQuery>;
export type LiquidAssignsQuerySuspenseQueryHookResult = ReturnType<typeof useLiquidAssignsQuerySuspenseQuery>;
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
export function useNotifierLiquidAssignsQuery(baseOptions: Apollo.QueryHookOptions<NotifierLiquidAssignsQueryData, NotifierLiquidAssignsQueryVariables> & ({ variables: NotifierLiquidAssignsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NotifierLiquidAssignsQueryData, NotifierLiquidAssignsQueryVariables>(NotifierLiquidAssignsQueryDocument, options);
      }
export function useNotifierLiquidAssignsQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NotifierLiquidAssignsQueryData, NotifierLiquidAssignsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NotifierLiquidAssignsQueryData, NotifierLiquidAssignsQueryVariables>(NotifierLiquidAssignsQueryDocument, options);
        }
export function useNotifierLiquidAssignsQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<NotifierLiquidAssignsQueryData, NotifierLiquidAssignsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<NotifierLiquidAssignsQueryData, NotifierLiquidAssignsQueryVariables>(NotifierLiquidAssignsQueryDocument, options);
        }
export type NotifierLiquidAssignsQueryHookResult = ReturnType<typeof useNotifierLiquidAssignsQuery>;
export type NotifierLiquidAssignsQueryLazyQueryHookResult = ReturnType<typeof useNotifierLiquidAssignsQueryLazyQuery>;
export type NotifierLiquidAssignsQuerySuspenseQueryHookResult = ReturnType<typeof useNotifierLiquidAssignsQuerySuspenseQuery>;
export type NotifierLiquidAssignsQueryQueryResult = Apollo.QueryResult<NotifierLiquidAssignsQueryData, NotifierLiquidAssignsQueryVariables>;