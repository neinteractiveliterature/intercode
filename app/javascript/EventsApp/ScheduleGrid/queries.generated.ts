/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { RunBasicSignupDataFragment, CommonConventionDataFragment } from '../queries.generated';
import { gql } from '@apollo/client';
import { RunBasicSignupDataFragmentDoc, CommonConventionDataFragmentDoc } from '../queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type ScheduleGridEventFragment = (
  { __typename: 'Event' }
  & Pick<Types.Event, 'id' | 'title' | 'length_seconds' | 'short_blurb_html' | 'my_rating' | 'can_play_concurrently'>
  & { event_category: (
    { __typename: 'EventCategory' }
    & Pick<Types.EventCategory, 'id' | 'name' | 'default_color' | 'signed_up_color' | 'full_color'>
  ), registration_policy?: Types.Maybe<(
    { __typename: 'RegistrationPolicy' }
    & Pick<Types.RegistrationPolicy, 'slots_limited' | 'only_uncounted' | 'total_slots' | 'total_slots_including_not_counted' | 'preferred_slots' | 'preferred_slots_including_not_counted' | 'minimum_slots' | 'minimum_slots_including_not_counted'>
    & { buckets: Array<(
      { __typename: 'RegistrationPolicyBucket' }
      & Pick<Types.RegistrationPolicyBucket, 'key' | 'not_counted' | 'total_slots' | 'slots_limited'>
    )> }
  )>, runs: Array<(
    { __typename: 'Run' }
    & Types.MakeOptional<Pick<Types.Run, 'id' | 'starts_at' | 'schedule_note' | 'title_suffix' | 'confirmed_signup_count' | 'not_counted_signup_count' | 'room_names'>, 'confirmed_signup_count' | 'not_counted_signup_count'>
    & RunBasicSignupDataFragment
  )> }
);

export type ScheduleGridConventionDataQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ScheduleGridConventionDataQueryData = (
  { __typename: 'Query' }
  & { convention: (
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'pre_schedule_content_html'>
    & CommonConventionDataFragment
  ) }
);

export type ScheduleGridEventsQueryVariables = Types.Exact<{
  extendedCounts: Types.Scalars['Boolean'];
  start?: Types.Maybe<Types.Scalars['Date']>;
  finish?: Types.Maybe<Types.Scalars['Date']>;
}>;


export type ScheduleGridEventsQueryData = (
  { __typename: 'Query' }
  & { events: Array<(
    { __typename: 'Event' }
    & Pick<Types.Event, 'id'>
    & ScheduleGridEventFragment
  )> }
);

export type ScheduleGridCombinedQueryVariables = Types.Exact<{
  extendedCounts: Types.Scalars['Boolean'];
  start?: Types.Maybe<Types.Scalars['Date']>;
  finish?: Types.Maybe<Types.Scalars['Date']>;
}>;


export type ScheduleGridCombinedQueryData = (
  { __typename: 'Query' }
  & { convention: (
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'pre_schedule_content_html'>
    & CommonConventionDataFragment
  ), events: Array<(
    { __typename: 'Event' }
    & Pick<Types.Event, 'id'>
    & ScheduleGridEventFragment
  )> }
);

export const ScheduleGridEventFragmentDoc = gql`
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
  convention: assertConvention {
    id
    pre_schedule_content_html
    ...CommonConventionData
  }
}
    ${CommonConventionDataFragmentDoc}`;

/**
 * __useScheduleGridConventionDataQuery__
 *
 * To run a query within a React component, call `useScheduleGridConventionDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useScheduleGridConventionDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useScheduleGridConventionDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useScheduleGridConventionDataQuery(baseOptions?: Apollo.QueryHookOptions<ScheduleGridConventionDataQueryData, ScheduleGridConventionDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ScheduleGridConventionDataQueryData, ScheduleGridConventionDataQueryVariables>(ScheduleGridConventionDataQueryDocument, options);
      }
export function useScheduleGridConventionDataQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ScheduleGridConventionDataQueryData, ScheduleGridConventionDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ScheduleGridConventionDataQueryData, ScheduleGridConventionDataQueryVariables>(ScheduleGridConventionDataQueryDocument, options);
        }
export type ScheduleGridConventionDataQueryHookResult = ReturnType<typeof useScheduleGridConventionDataQuery>;
export type ScheduleGridConventionDataQueryLazyQueryHookResult = ReturnType<typeof useScheduleGridConventionDataQueryLazyQuery>;
export type ScheduleGridConventionDataQueryQueryResult = Apollo.QueryResult<ScheduleGridConventionDataQueryData, ScheduleGridConventionDataQueryVariables>;
export const ScheduleGridEventsQueryDocument = gql`
    query ScheduleGridEventsQuery($extendedCounts: Boolean!, $start: Date, $finish: Date) {
  events(extendedCounts: $extendedCounts, start: $start, finish: $finish) {
    id
    ...ScheduleGridEventFragment
  }
}
    ${ScheduleGridEventFragmentDoc}`;

/**
 * __useScheduleGridEventsQuery__
 *
 * To run a query within a React component, call `useScheduleGridEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useScheduleGridEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useScheduleGridEventsQuery({
 *   variables: {
 *      extendedCounts: // value for 'extendedCounts'
 *      start: // value for 'start'
 *      finish: // value for 'finish'
 *   },
 * });
 */
export function useScheduleGridEventsQuery(baseOptions: Apollo.QueryHookOptions<ScheduleGridEventsQueryData, ScheduleGridEventsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ScheduleGridEventsQueryData, ScheduleGridEventsQueryVariables>(ScheduleGridEventsQueryDocument, options);
      }
export function useScheduleGridEventsQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ScheduleGridEventsQueryData, ScheduleGridEventsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ScheduleGridEventsQueryData, ScheduleGridEventsQueryVariables>(ScheduleGridEventsQueryDocument, options);
        }
export type ScheduleGridEventsQueryHookResult = ReturnType<typeof useScheduleGridEventsQuery>;
export type ScheduleGridEventsQueryLazyQueryHookResult = ReturnType<typeof useScheduleGridEventsQueryLazyQuery>;
export type ScheduleGridEventsQueryQueryResult = Apollo.QueryResult<ScheduleGridEventsQueryData, ScheduleGridEventsQueryVariables>;
export const ScheduleGridCombinedQueryDocument = gql`
    query ScheduleGridCombinedQuery($extendedCounts: Boolean!, $start: Date, $finish: Date) {
  convention: assertConvention {
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
${ScheduleGridEventFragmentDoc}`;

/**
 * __useScheduleGridCombinedQuery__
 *
 * To run a query within a React component, call `useScheduleGridCombinedQuery` and pass it any options that fit your needs.
 * When your component renders, `useScheduleGridCombinedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useScheduleGridCombinedQuery({
 *   variables: {
 *      extendedCounts: // value for 'extendedCounts'
 *      start: // value for 'start'
 *      finish: // value for 'finish'
 *   },
 * });
 */
export function useScheduleGridCombinedQuery(baseOptions: Apollo.QueryHookOptions<ScheduleGridCombinedQueryData, ScheduleGridCombinedQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ScheduleGridCombinedQueryData, ScheduleGridCombinedQueryVariables>(ScheduleGridCombinedQueryDocument, options);
      }
export function useScheduleGridCombinedQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ScheduleGridCombinedQueryData, ScheduleGridCombinedQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ScheduleGridCombinedQueryData, ScheduleGridCombinedQueryVariables>(ScheduleGridCombinedQueryDocument, options);
        }
export type ScheduleGridCombinedQueryHookResult = ReturnType<typeof useScheduleGridCombinedQuery>;
export type ScheduleGridCombinedQueryLazyQueryHookResult = ReturnType<typeof useScheduleGridCombinedQueryLazyQuery>;
export type ScheduleGridCombinedQueryQueryResult = Apollo.QueryResult<ScheduleGridCombinedQueryData, ScheduleGridCombinedQueryVariables>;