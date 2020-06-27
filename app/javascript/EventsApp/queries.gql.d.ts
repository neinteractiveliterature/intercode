/* eslint-disable */
import * as Types from '../@types/graphql';

import * as Operations from './queries';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };


export type CommonConventionDataFragment = (
  { __typename?: 'Convention' }
  & Pick<Types.Convention, 'id' | 'name' | 'starts_at' | 'ends_at' | 'site_mode' | 'timezone_name' | 'ticket_name' | 'ticket_mode'>
  & { event_categories: Array<(
    { __typename?: 'EventCategory' }
    & Pick<Types.EventCategory, 'id' | 'name' | 'scheduling_ui' | 'default_color' | 'full_color' | 'signed_up_color'>
  )> }
);

export type RunBasicSignupDataFragment = (
  { __typename?: 'Run' }
  & Pick<Types.Run, 'id' | 'signup_count_by_state_and_bucket_key_and_counted'>
  & { my_signups?: Types.Maybe<Array<Types.Maybe<(
    { __typename?: 'Signup' }
    & Pick<Types.Signup, 'id' | 'state'>
  )>>>, my_signup_requests: Array<(
    { __typename?: 'SignupRequest' }
    & Pick<Types.SignupRequest, 'id' | 'state'>
  )> }
);

export type CommonConventionDataQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type CommonConventionDataQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & CommonConventionDataFragment
  )> }
);



/**
 * __useCommonConventionDataQueryQuery__
 *
 * To run a query within a React component, call `useCommonConventionDataQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useCommonConventionDataQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCommonConventionDataQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useCommonConventionDataQueryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<CommonConventionDataQueryQuery, CommonConventionDataQueryQueryVariables>) {
        return ApolloReactHooks.useQuery<CommonConventionDataQueryQuery, CommonConventionDataQueryQueryVariables>(Operations.CommonConventionDataQuery, baseOptions);
      }
export function useCommonConventionDataQueryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<CommonConventionDataQueryQuery, CommonConventionDataQueryQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<CommonConventionDataQueryQuery, CommonConventionDataQueryQueryVariables>(Operations.CommonConventionDataQuery, baseOptions);
        }
export type CommonConventionDataQueryQueryHookResult = ReturnType<typeof useCommonConventionDataQueryQuery>;
export type CommonConventionDataQueryLazyQueryHookResult = ReturnType<typeof useCommonConventionDataQueryLazyQuery>;
export type CommonConventionDataQueryQueryResult = ApolloReactCommon.QueryResult<CommonConventionDataQueryQuery, CommonConventionDataQueryQueryVariables>;