/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { RunBasicSignupDataFragmentDoc, CommonConventionDataFragmentDoc } from '../queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ScheduleGridEventFragment = { __typename: 'Event', id: string, title?: string | null, length_seconds: number, short_blurb_html?: string | null, my_rating?: number | null, can_play_concurrently: boolean, form_response_attrs_json_with_rendered_markdown?: string | null, event_category: { __typename: 'EventCategory', id: string }, registration_policy?: { __typename: 'RegistrationPolicy', slots_limited?: boolean | null, only_uncounted?: boolean | null, total_slots?: number | null, total_slots_including_not_counted?: number | null, preferred_slots?: number | null, preferred_slots_including_not_counted?: number | null, minimum_slots?: number | null, minimum_slots_including_not_counted?: number | null, buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, not_counted: boolean, total_slots?: number | null, slots_limited: boolean }> } | null, runs: Array<{ __typename: 'Run', id: string, starts_at: string, schedule_note?: string | null, title_suffix?: string | null, confirmed_signup_count: number, not_counted_signup_count: number, room_names: Array<string>, grouped_signup_counts: Array<{ __typename: 'GroupedSignupCount', bucket_key?: string | null, count: number, counted: boolean, state: Types.SignupState, team_member: boolean }>, my_signups: Array<{ __typename: 'Signup', id: string, state: Types.SignupState }>, my_signup_requests: Array<{ __typename: 'SignupRequest', id: string, state: Types.SignupRequestState }> }> };

export type ScheduleGridConventionDataQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ScheduleGridConventionDataQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, pre_schedule_content_html?: string | null, name: string, starts_at?: string | null, ends_at?: string | null, signup_mode: Types.SignupMode, site_mode: Types.SiteMode, timezone_name?: string | null, timezone_mode: Types.TimezoneMode, ticket_name: string, ticket_mode: Types.TicketMode, event_categories: Array<{ __typename: 'EventCategory', id: string, name: string, scheduling_ui: Types.SchedulingUi, default_color?: string | null, full_color?: string | null, signed_up_color?: string | null, team_member_name: string, teamMemberNamePlural: string, event_form: { __typename: 'Form', id: string, form_sections: Array<{ __typename: 'FormSection', id: string, form_items: Array<{ __typename: 'FormItem', id: string, public_description?: string | null, default_value?: string | null, position: number, identifier?: string | null, item_type: string, rendered_properties: string, visibility: Types.FormItemRole, writeability: Types.FormItemRole, expose_in?: Array<Types.FormItemExposeIn> | null }> }> } }> } };

export type ScheduleGridEventsQueryVariables = Types.Exact<{
  start?: Types.InputMaybe<Types.Scalars['Date']['input']>;
  finish?: Types.InputMaybe<Types.Scalars['Date']['input']>;
  filters?: Types.InputMaybe<Types.EventFiltersInput>;
  fetchFormItemIdentifiers?: Types.InputMaybe<Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input']>;
}>;


export type ScheduleGridEventsQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, events: Array<{ __typename: 'Event', id: string, title?: string | null, length_seconds: number, short_blurb_html?: string | null, my_rating?: number | null, can_play_concurrently: boolean, form_response_attrs_json_with_rendered_markdown?: string | null, event_category: { __typename: 'EventCategory', id: string }, registration_policy?: { __typename: 'RegistrationPolicy', slots_limited?: boolean | null, only_uncounted?: boolean | null, total_slots?: number | null, total_slots_including_not_counted?: number | null, preferred_slots?: number | null, preferred_slots_including_not_counted?: number | null, minimum_slots?: number | null, minimum_slots_including_not_counted?: number | null, buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, not_counted: boolean, total_slots?: number | null, slots_limited: boolean }> } | null, runs: Array<{ __typename: 'Run', id: string, starts_at: string, schedule_note?: string | null, title_suffix?: string | null, confirmed_signup_count: number, not_counted_signup_count: number, room_names: Array<string>, grouped_signup_counts: Array<{ __typename: 'GroupedSignupCount', bucket_key?: string | null, count: number, counted: boolean, state: Types.SignupState, team_member: boolean }>, my_signups: Array<{ __typename: 'Signup', id: string, state: Types.SignupState }>, my_signup_requests: Array<{ __typename: 'SignupRequest', id: string, state: Types.SignupRequestState }> }> }> } };

export const ScheduleGridEventFragmentDoc = gql`
    fragment ScheduleGridEventFragment on Event {
  id
  title
  length_seconds
  short_blurb_html
  my_rating
  can_play_concurrently
  form_response_attrs_json_with_rendered_markdown(
    itemIdentifiers: $fetchFormItemIdentifiers
  )
  event_category {
    id
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
    confirmed_signup_count
    not_counted_signup_count
    room_names
  }
}
    ${RunBasicSignupDataFragmentDoc}`;
export const ScheduleGridConventionDataQueryDocument = gql`
    query ScheduleGridConventionDataQuery {
  convention: conventionByRequestHost {
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
export function useScheduleGridConventionDataQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ScheduleGridConventionDataQueryData, ScheduleGridConventionDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ScheduleGridConventionDataQueryData, ScheduleGridConventionDataQueryVariables>(ScheduleGridConventionDataQueryDocument, options);
        }
export type ScheduleGridConventionDataQueryHookResult = ReturnType<typeof useScheduleGridConventionDataQuery>;
export type ScheduleGridConventionDataQueryLazyQueryHookResult = ReturnType<typeof useScheduleGridConventionDataQueryLazyQuery>;
export type ScheduleGridConventionDataQuerySuspenseQueryHookResult = ReturnType<typeof useScheduleGridConventionDataQuerySuspenseQuery>;
export type ScheduleGridConventionDataQueryQueryResult = Apollo.QueryResult<ScheduleGridConventionDataQueryData, ScheduleGridConventionDataQueryVariables>;
export const ScheduleGridEventsQueryDocument = gql`
    query ScheduleGridEventsQuery($start: Date, $finish: Date, $filters: EventFiltersInput, $fetchFormItemIdentifiers: [String!]) {
  convention: conventionByRequestHost {
    id
    events(start: $start, finish: $finish, filters: $filters) {
      id
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
 *      filters: // value for 'filters'
 *      fetchFormItemIdentifiers: // value for 'fetchFormItemIdentifiers'
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
export function useScheduleGridEventsQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ScheduleGridEventsQueryData, ScheduleGridEventsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ScheduleGridEventsQueryData, ScheduleGridEventsQueryVariables>(ScheduleGridEventsQueryDocument, options);
        }
export type ScheduleGridEventsQueryHookResult = ReturnType<typeof useScheduleGridEventsQuery>;
export type ScheduleGridEventsQueryLazyQueryHookResult = ReturnType<typeof useScheduleGridEventsQueryLazyQuery>;
export type ScheduleGridEventsQuerySuspenseQueryHookResult = ReturnType<typeof useScheduleGridEventsQuerySuspenseQuery>;
export type ScheduleGridEventsQueryQueryResult = Apollo.QueryResult<ScheduleGridEventsQueryData, ScheduleGridEventsQueryVariables>;