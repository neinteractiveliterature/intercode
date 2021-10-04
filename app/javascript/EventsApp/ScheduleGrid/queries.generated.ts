/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { RunBasicSignupDataFragmentDoc } from '../queries.generated';
import { CommonConventionDataFragmentDoc } from '../queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type ScheduleGridEventFragment = { __typename: 'Event', title?: string | null | undefined, length_seconds: number, short_blurb_html?: string | null | undefined, my_rating?: number | null | undefined, can_play_concurrently: boolean, id: string, event_category: { __typename: 'EventCategory', name: string, default_color?: string | null | undefined, signed_up_color?: string | null | undefined, full_color?: string | null | undefined, id: string }, registration_policy?: { __typename: 'RegistrationPolicy', slots_limited?: boolean | null | undefined, only_uncounted?: boolean | null | undefined, total_slots?: number | null | undefined, total_slots_including_not_counted?: number | null | undefined, preferred_slots?: number | null | undefined, preferred_slots_including_not_counted?: number | null | undefined, minimum_slots?: number | null | undefined, minimum_slots_including_not_counted?: number | null | undefined, buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, not_counted: boolean, total_slots?: number | null | undefined, slots_limited: boolean }> } | null | undefined, runs: Array<{ __typename: 'Run', starts_at: any, schedule_note?: string | null | undefined, title_suffix?: string | null | undefined, confirmed_signup_count: number, not_counted_signup_count: number, room_names: Array<string>, signup_count_by_state_and_bucket_key_and_counted: any, id: string, my_signups: Array<{ __typename: 'Signup', state: Types.SignupState, id: string }>, my_signup_requests: Array<{ __typename: 'SignupRequest', state: Types.SignupRequestState, id: string }> }> };

export type ScheduleGridConventionDataQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ScheduleGridConventionDataQueryData = { __typename: 'Query', convention: { __typename: 'Convention', pre_schedule_content_html?: string | null | undefined, name: string, starts_at?: any | null | undefined, ends_at?: any | null | undefined, site_mode: Types.SiteMode, timezone_name?: string | null | undefined, timezone_mode: Types.TimezoneMode, ticket_name: string, ticket_mode: Types.TicketMode, id: string, event_categories: Array<{ __typename: 'EventCategory', name: string, scheduling_ui: Types.SchedulingUi, default_color?: string | null | undefined, full_color?: string | null | undefined, signed_up_color?: string | null | undefined, id: string }> } };

export type ScheduleGridEventsQueryVariables = Types.Exact<{
  start?: Types.Maybe<Types.Scalars['Date']>;
  finish?: Types.Maybe<Types.Scalars['Date']>;
}>;


export type ScheduleGridEventsQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, events: Array<{ __typename: 'Event', title?: string | null | undefined, length_seconds: number, short_blurb_html?: string | null | undefined, my_rating?: number | null | undefined, can_play_concurrently: boolean, id: string, event_category: { __typename: 'EventCategory', name: string, default_color?: string | null | undefined, signed_up_color?: string | null | undefined, full_color?: string | null | undefined, id: string }, registration_policy?: { __typename: 'RegistrationPolicy', slots_limited?: boolean | null | undefined, only_uncounted?: boolean | null | undefined, total_slots?: number | null | undefined, total_slots_including_not_counted?: number | null | undefined, preferred_slots?: number | null | undefined, preferred_slots_including_not_counted?: number | null | undefined, minimum_slots?: number | null | undefined, minimum_slots_including_not_counted?: number | null | undefined, buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, not_counted: boolean, total_slots?: number | null | undefined, slots_limited: boolean }> } | null | undefined, runs: Array<{ __typename: 'Run', starts_at: any, schedule_note?: string | null | undefined, title_suffix?: string | null | undefined, confirmed_signup_count: number, not_counted_signup_count: number, room_names: Array<string>, signup_count_by_state_and_bucket_key_and_counted: any, id: string, my_signups: Array<{ __typename: 'Signup', state: Types.SignupState, id: string }>, my_signup_requests: Array<{ __typename: 'SignupRequest', state: Types.SignupRequestState, id: string }> }> }> } };

export type ScheduleGridCombinedQueryVariables = Types.Exact<{
  start?: Types.Maybe<Types.Scalars['Date']>;
  finish?: Types.Maybe<Types.Scalars['Date']>;
}>;


export type ScheduleGridCombinedQueryData = { __typename: 'Query', convention: { __typename: 'Convention', pre_schedule_content_html?: string | null | undefined, name: string, starts_at?: any | null | undefined, ends_at?: any | null | undefined, site_mode: Types.SiteMode, timezone_name?: string | null | undefined, timezone_mode: Types.TimezoneMode, ticket_name: string, ticket_mode: Types.TicketMode, id: string, events: Array<{ __typename: 'Event', title?: string | null | undefined, length_seconds: number, short_blurb_html?: string | null | undefined, my_rating?: number | null | undefined, can_play_concurrently: boolean, id: string, event_category: { __typename: 'EventCategory', name: string, default_color?: string | null | undefined, signed_up_color?: string | null | undefined, full_color?: string | null | undefined, id: string }, registration_policy?: { __typename: 'RegistrationPolicy', slots_limited?: boolean | null | undefined, only_uncounted?: boolean | null | undefined, total_slots?: number | null | undefined, total_slots_including_not_counted?: number | null | undefined, preferred_slots?: number | null | undefined, preferred_slots_including_not_counted?: number | null | undefined, minimum_slots?: number | null | undefined, minimum_slots_including_not_counted?: number | null | undefined, buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, not_counted: boolean, total_slots?: number | null | undefined, slots_limited: boolean }> } | null | undefined, runs: Array<{ __typename: 'Run', starts_at: any, schedule_note?: string | null | undefined, title_suffix?: string | null | undefined, confirmed_signup_count: number, not_counted_signup_count: number, room_names: Array<string>, signup_count_by_state_and_bucket_key_and_counted: any, id: string, my_signups: Array<{ __typename: 'Signup', state: Types.SignupState, id: string }>, my_signup_requests: Array<{ __typename: 'SignupRequest', state: Types.SignupRequestState, id: string }> }> }>, event_categories: Array<{ __typename: 'EventCategory', name: string, scheduling_ui: Types.SchedulingUi, default_color?: string | null | undefined, full_color?: string | null | undefined, signed_up_color?: string | null | undefined, id: string }> } };

export const ScheduleGridEventFragmentDoc = gql`
    fragment ScheduleGridEventFragment on Event {
  id: transitionalId
  title
  length_seconds
  short_blurb_html
  my_rating
  can_play_concurrently
  event_category {
    id: transitionalId
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
    id: transitionalId
    starts_at
    schedule_note
    title_suffix
    ...RunBasicSignupData
    confirmed_signup_count
    not_counted_signup_count
    room_names
  }
}
    ${RunBasicSignupDataFragmentDoc}`;
export const ScheduleGridConventionDataQueryDocument = gql`
    query ScheduleGridConventionDataQuery {
  convention: conventionByRequestHost {
    id: transitionalId
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
    query ScheduleGridEventsQuery($start: Date, $finish: Date) {
  convention: conventionByRequestHost {
    id: transitionalId
    events(start: $start, finish: $finish) {
      id: transitionalId
      ...ScheduleGridEventFragment
    }
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
 *      start: // value for 'start'
 *      finish: // value for 'finish'
 *   },
 * });
 */
export function useScheduleGridEventsQuery(baseOptions?: Apollo.QueryHookOptions<ScheduleGridEventsQueryData, ScheduleGridEventsQueryVariables>) {
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
    query ScheduleGridCombinedQuery($start: Date, $finish: Date) {
  convention: conventionByRequestHost {
    id: transitionalId
    pre_schedule_content_html
    ...CommonConventionData
    events(start: $start, finish: $finish) {
      id: transitionalId
      ...ScheduleGridEventFragment
    }
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
 *      start: // value for 'start'
 *      finish: // value for 'finish'
 *   },
 * });
 */
export function useScheduleGridCombinedQuery(baseOptions?: Apollo.QueryHookOptions<ScheduleGridCombinedQueryData, ScheduleGridCombinedQueryVariables>) {
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