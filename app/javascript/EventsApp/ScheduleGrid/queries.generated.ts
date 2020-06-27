/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { RunBasicSignupDataFragment, CommonConventionDataFragment } from '../queries.generated';
import gql from 'graphql-tag';
import { RunBasicSignupDataFragmentDoc, CommonConventionDataFragmentDoc } from '../queries.generated';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };


export type ScheduleGridEventFragmentFragment = (
  { __typename?: 'Event' }
  & Pick<Types.Event, 'id' | 'title' | 'length_seconds' | 'short_blurb_html' | 'my_rating' | 'can_play_concurrently'>
  & { event_category: (
    { __typename?: 'EventCategory' }
    & Pick<Types.EventCategory, 'id' | 'name' | 'default_color' | 'signed_up_color' | 'full_color'>
  ), registration_policy?: Types.Maybe<(
    { __typename?: 'RegistrationPolicy' }
    & Pick<Types.RegistrationPolicy, 'slots_limited' | 'only_uncounted' | 'total_slots' | 'total_slots_including_not_counted' | 'preferred_slots' | 'preferred_slots_including_not_counted' | 'minimum_slots' | 'minimum_slots_including_not_counted'>
    & { buckets: Array<(
      { __typename?: 'RegistrationPolicyBucket' }
      & Pick<Types.RegistrationPolicyBucket, 'key' | 'not_counted' | 'total_slots' | 'slots_limited'>
    )> }
  )>, runs: Array<(
    { __typename?: 'Run' }
    & Pick<Types.Run, 'id' | 'starts_at' | 'schedule_note' | 'title_suffix' | 'confirmed_signup_count' | 'not_counted_signup_count' | 'room_names'>
    & RunBasicSignupDataFragment
  )> }
);

export type ScheduleGridConventionDataQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type ScheduleGridConventionDataQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id' | 'pre_schedule_content_html'>
    & CommonConventionDataFragment
  )> }
);

export type ScheduleGridEventsQueryQueryVariables = Exact<{
  extendedCounts: Types.Scalars['Boolean'];
  start?: Types.Maybe<Types.Scalars['Date']>;
  finish?: Types.Maybe<Types.Scalars['Date']>;
}>;


export type ScheduleGridEventsQueryQuery = (
  { __typename?: 'Query' }
  & { events: Array<(
    { __typename?: 'Event' }
    & Pick<Types.Event, 'id'>
    & ScheduleGridEventFragmentFragment
  )> }
);

export type ScheduleGridCombinedQueryQueryVariables = Exact<{
  extendedCounts: Types.Scalars['Boolean'];
  start?: Types.Maybe<Types.Scalars['Date']>;
  finish?: Types.Maybe<Types.Scalars['Date']>;
}>;


export type ScheduleGridCombinedQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id' | 'pre_schedule_content_html'>
    & CommonConventionDataFragment
  )>, events: Array<(
    { __typename?: 'Event' }
    & Pick<Types.Event, 'id'>
    & ScheduleGridEventFragmentFragment
  )> }
);

export const ScheduleGridEventFragmentFragmentDoc = gql`
    fragment ScheduleGridEventFragment on Event {
  id
  title
  length_seconds
  short_blurb_html
  my_rating
  can_play_concurrently
  event_category {
    id
    name
    default_color
    signed_up_color
    full_color
  }
  registration_policy {
    slots_limited
    only_uncounted
    total_slots
    total_slots_including_not_counted
    preferred_slots
    preferred_slots_including_not_counted
    minimum_slots
    minimum_slots_including_not_counted
    buckets {
      key
      not_counted
      total_slots
      slots_limited
    }
  }
  runs(start: $start, finish: $finish) {
    id
    starts_at
    schedule_note
    title_suffix
    ...RunBasicSignupData
    confirmed_signup_count @include(if: $extendedCounts)
    not_counted_signup_count @include(if: $extendedCounts)
    room_names
  }
}
    ${RunBasicSignupDataFragmentDoc}`;
export const ScheduleGridConventionDataQueryDocument = gql`
    query ScheduleGridConventionDataQuery {
  convention {
    id
    pre_schedule_content_html
    ...CommonConventionData
  }
}
    ${CommonConventionDataFragmentDoc}`;

/**
 * __useScheduleGridConventionDataQueryQuery__
 *
 * To run a query within a React component, call `useScheduleGridConventionDataQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useScheduleGridConventionDataQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useScheduleGridConventionDataQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useScheduleGridConventionDataQueryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ScheduleGridConventionDataQueryQuery, ScheduleGridConventionDataQueryQueryVariables>) {
        return ApolloReactHooks.useQuery<ScheduleGridConventionDataQueryQuery, ScheduleGridConventionDataQueryQueryVariables>(ScheduleGridConventionDataQueryDocument, baseOptions);
      }
export function useScheduleGridConventionDataQueryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ScheduleGridConventionDataQueryQuery, ScheduleGridConventionDataQueryQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ScheduleGridConventionDataQueryQuery, ScheduleGridConventionDataQueryQueryVariables>(ScheduleGridConventionDataQueryDocument, baseOptions);
        }
export type ScheduleGridConventionDataQueryQueryHookResult = ReturnType<typeof useScheduleGridConventionDataQueryQuery>;
export type ScheduleGridConventionDataQueryLazyQueryHookResult = ReturnType<typeof useScheduleGridConventionDataQueryLazyQuery>;
export type ScheduleGridConventionDataQueryQueryResult = ApolloReactCommon.QueryResult<ScheduleGridConventionDataQueryQuery, ScheduleGridConventionDataQueryQueryVariables>;
export const ScheduleGridEventsQueryDocument = gql`
    query ScheduleGridEventsQuery($extendedCounts: Boolean!, $start: Date, $finish: Date) {
  events(extendedCounts: $extendedCounts, start: $start, finish: $finish) {
    id
    ...ScheduleGridEventFragment
  }
}
    ${ScheduleGridEventFragmentFragmentDoc}`;

/**
 * __useScheduleGridEventsQueryQuery__
 *
 * To run a query within a React component, call `useScheduleGridEventsQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useScheduleGridEventsQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useScheduleGridEventsQueryQuery({
 *   variables: {
 *      extendedCounts: // value for 'extendedCounts'
 *      start: // value for 'start'
 *      finish: // value for 'finish'
 *   },
 * });
 */
export function useScheduleGridEventsQueryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ScheduleGridEventsQueryQuery, ScheduleGridEventsQueryQueryVariables>) {
        return ApolloReactHooks.useQuery<ScheduleGridEventsQueryQuery, ScheduleGridEventsQueryQueryVariables>(ScheduleGridEventsQueryDocument, baseOptions);
      }
export function useScheduleGridEventsQueryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ScheduleGridEventsQueryQuery, ScheduleGridEventsQueryQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ScheduleGridEventsQueryQuery, ScheduleGridEventsQueryQueryVariables>(ScheduleGridEventsQueryDocument, baseOptions);
        }
export type ScheduleGridEventsQueryQueryHookResult = ReturnType<typeof useScheduleGridEventsQueryQuery>;
export type ScheduleGridEventsQueryLazyQueryHookResult = ReturnType<typeof useScheduleGridEventsQueryLazyQuery>;
export type ScheduleGridEventsQueryQueryResult = ApolloReactCommon.QueryResult<ScheduleGridEventsQueryQuery, ScheduleGridEventsQueryQueryVariables>;
export const ScheduleGridCombinedQueryDocument = gql`
    query ScheduleGridCombinedQuery($extendedCounts: Boolean!, $start: Date, $finish: Date) {
  convention {
    id
    pre_schedule_content_html
    ...CommonConventionData
  }
  events(extendedCounts: $extendedCounts, start: $start, finish: $finish) {
    id
    ...ScheduleGridEventFragment
  }
}
    ${CommonConventionDataFragmentDoc}
${ScheduleGridEventFragmentFragmentDoc}`;

/**
 * __useScheduleGridCombinedQueryQuery__
 *
 * To run a query within a React component, call `useScheduleGridCombinedQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useScheduleGridCombinedQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useScheduleGridCombinedQueryQuery({
 *   variables: {
 *      extendedCounts: // value for 'extendedCounts'
 *      start: // value for 'start'
 *      finish: // value for 'finish'
 *   },
 * });
 */
export function useScheduleGridCombinedQueryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ScheduleGridCombinedQueryQuery, ScheduleGridCombinedQueryQueryVariables>) {
        return ApolloReactHooks.useQuery<ScheduleGridCombinedQueryQuery, ScheduleGridCombinedQueryQueryVariables>(ScheduleGridCombinedQueryDocument, baseOptions);
      }
export function useScheduleGridCombinedQueryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ScheduleGridCombinedQueryQuery, ScheduleGridCombinedQueryQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ScheduleGridCombinedQueryQuery, ScheduleGridCombinedQueryQueryVariables>(ScheduleGridCombinedQueryDocument, baseOptions);
        }
export type ScheduleGridCombinedQueryQueryHookResult = ReturnType<typeof useScheduleGridCombinedQueryQuery>;
export type ScheduleGridCombinedQueryLazyQueryHookResult = ReturnType<typeof useScheduleGridCombinedQueryLazyQuery>;
export type ScheduleGridCombinedQueryQueryResult = ApolloReactCommon.QueryResult<ScheduleGridCombinedQueryQuery, ScheduleGridCombinedQueryQueryVariables>;