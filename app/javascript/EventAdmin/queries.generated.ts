/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { CommonFormFieldsFragmentDoc } from '../Models/commonFormFragments.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type TicketTypeFieldsFragment = { __typename: 'TicketType', id: string, description?: string | null, maximum_event_provided_tickets: number };

export type MaximumEventProvidedTicketsOverrideFieldsFragment = { __typename: 'MaximumEventProvidedTicketsOverride', id: string, override_value: number, ticket_type: { __typename: 'TicketType', id: string, description?: string | null, maximum_event_provided_tickets: number } };

export type RoomFieldsFragment = { __typename: 'Room', id: string, name?: string | null };

export type EventPageEventCategoryFieldsFragment = { __typename: 'EventCategory', id: string, name: string, scheduling_ui: Types.SchedulingUi, default_color?: string | null, full_color?: string | null, signed_up_color?: string | null, teamMemberNamePlural: string, team_member_name: string, event_form: { __typename: 'Form', id: string, title: string, form_type: Types.FormType, form_sections: Array<{ __typename: 'FormSection', id: string, title?: string | null, position: number, form_items: Array<{ __typename: 'FormItem', id: string, admin_description?: string | null, position: number, identifier?: string | null, item_type: string, rendered_properties: string, default_value?: string | null, visibility: Types.FormItemRole, writeability: Types.FormItemRole, expose_in?: Array<Types.FormItemExposeIn> | null }> }> } };

export type ConventionFieldsFragment = { __typename: 'Convention', id: string, name: string, starts_at?: string | null, ends_at?: string | null, timezone_name?: string | null, timezone_mode: Types.TimezoneMode, event_mailing_list_domain?: string | null, site_mode: Types.SiteMode, signup_mode: Types.SignupMode, ticket_name: string, ticket_mode: Types.TicketMode, event_categories: Array<{ __typename: 'EventCategory', id: string, name: string, scheduling_ui: Types.SchedulingUi, default_color?: string | null, full_color?: string | null, signed_up_color?: string | null, teamMemberNamePlural: string, team_member_name: string, event_form: { __typename: 'Form', id: string, title: string, form_type: Types.FormType, form_sections: Array<{ __typename: 'FormSection', id: string, title?: string | null, position: number, form_items: Array<{ __typename: 'FormItem', id: string, admin_description?: string | null, position: number, identifier?: string | null, item_type: string, rendered_properties: string, default_value?: string | null, visibility: Types.FormItemRole, writeability: Types.FormItemRole, expose_in?: Array<Types.FormItemExposeIn> | null }> }> } }>, rooms: Array<{ __typename: 'Room', id: string, name?: string | null }>, ticket_types: Array<{ __typename: 'TicketType', id: string, description?: string | null, maximum_event_provided_tickets: number }> };

export type RunFieldsFragment = { __typename: 'Run', id: string, starts_at: string, schedule_note?: string | null, title_suffix?: string | null, room_names: Array<string>, confirmed_signup_count: number, not_counted_signup_count: number, grouped_signup_counts: Array<{ __typename: 'GroupedSignupCount', bucket_key?: string | null, count: number, counted: boolean, state: Types.SignupState, team_member: boolean }>, rooms: Array<{ __typename: 'Room', id: string, name?: string | null }>, my_signups: Array<{ __typename: 'Signup', id: string, state: Types.SignupState }>, my_signup_requests: Array<{ __typename: 'SignupRequest', id: string, state: Types.SignupRequestState }> };

export type EventFieldsFragment = { __typename: 'Event', id: string, title?: string | null, author?: string | null, description?: string | null, organization?: string | null, url?: string | null, con_mail_destination?: string | null, can_play_concurrently: boolean, short_blurb?: string | null, participant_communications?: string | null, content_warnings?: string | null, email?: string | null, length_seconds: number, status?: string | null, description_html?: string | null, current_user_form_item_viewer_role: Types.FormItemRole, current_user_form_item_writer_role: Types.FormItemRole, admin_notes?: string | null, event_category: { __typename: 'EventCategory', id: string }, registration_policy?: { __typename: 'RegistrationPolicy', slots_limited?: boolean | null, prevent_no_preference_signups: boolean, buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, name?: string | null, description?: string | null, minimum_slots?: number | null, preferred_slots?: number | null, total_slots?: number | null, slots_limited: boolean, anything: boolean, not_counted: boolean }> } | null, runs: Array<{ __typename: 'Run', id: string, starts_at: string, schedule_note?: string | null, title_suffix?: string | null, room_names: Array<string>, confirmed_signup_count: number, not_counted_signup_count: number, grouped_signup_counts: Array<{ __typename: 'GroupedSignupCount', bucket_key?: string | null, count: number, counted: boolean, state: Types.SignupState, team_member: boolean }>, rooms: Array<{ __typename: 'Room', id: string, name?: string | null }>, my_signups: Array<{ __typename: 'Signup', id: string, state: Types.SignupState }>, my_signup_requests: Array<{ __typename: 'SignupRequest', id: string, state: Types.SignupRequestState }> }>, maximum_event_provided_tickets_overrides: Array<{ __typename: 'MaximumEventProvidedTicketsOverride', id: string, override_value: number, ticket_type: { __typename: 'TicketType', id: string, description?: string | null, maximum_event_provided_tickets: number } }>, images: Array<{ __typename: 'ActiveStorageAttachment', id: string, byte_size: number, content_type: string, filename: string, url: string }> };

export type EventAdminSingleEventQueryVariables = Types.Exact<{
  eventId: Types.Scalars['ID']['input'];
}>;


export type EventAdminSingleEventQueryData = { __typename: 'Query', conventionByRequestHost: { __typename: 'Convention', id: string, event: { __typename: 'Event', id: string, form_response_attrs_json?: string | null, title?: string | null, author?: string | null, description?: string | null, organization?: string | null, url?: string | null, con_mail_destination?: string | null, can_play_concurrently: boolean, short_blurb?: string | null, participant_communications?: string | null, content_warnings?: string | null, email?: string | null, length_seconds: number, status?: string | null, description_html?: string | null, current_user_form_item_viewer_role: Types.FormItemRole, current_user_form_item_writer_role: Types.FormItemRole, admin_notes?: string | null, event_category: { __typename: 'EventCategory', id: string }, registration_policy?: { __typename: 'RegistrationPolicy', slots_limited?: boolean | null, prevent_no_preference_signups: boolean, buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, name?: string | null, description?: string | null, minimum_slots?: number | null, preferred_slots?: number | null, total_slots?: number | null, slots_limited: boolean, anything: boolean, not_counted: boolean }> } | null, runs: Array<{ __typename: 'Run', id: string, starts_at: string, schedule_note?: string | null, title_suffix?: string | null, room_names: Array<string>, confirmed_signup_count: number, not_counted_signup_count: number, grouped_signup_counts: Array<{ __typename: 'GroupedSignupCount', bucket_key?: string | null, count: number, counted: boolean, state: Types.SignupState, team_member: boolean }>, rooms: Array<{ __typename: 'Room', id: string, name?: string | null }>, my_signups: Array<{ __typename: 'Signup', id: string, state: Types.SignupState }>, my_signup_requests: Array<{ __typename: 'SignupRequest', id: string, state: Types.SignupRequestState }> }>, maximum_event_provided_tickets_overrides: Array<{ __typename: 'MaximumEventProvidedTicketsOverride', id: string, override_value: number, ticket_type: { __typename: 'TicketType', id: string, description?: string | null, maximum_event_provided_tickets: number } }>, images: Array<{ __typename: 'ActiveStorageAttachment', id: string, byte_size: number, content_type: string, filename: string, url: string }> } } };

export type EventAdminEventsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type EventAdminEventsQueryData = { __typename: 'Query', currentAbility: { __typename: 'Ability', can_override_maximum_event_provided_tickets: boolean, can_manage_runs: boolean }, convention: { __typename: 'Convention', id: string, name: string, starts_at?: string | null, ends_at?: string | null, timezone_name?: string | null, timezone_mode: Types.TimezoneMode, event_mailing_list_domain?: string | null, site_mode: Types.SiteMode, signup_mode: Types.SignupMode, ticket_name: string, ticket_mode: Types.TicketMode, events: Array<{ __typename: 'Event', id: string, title?: string | null, author?: string | null, description?: string | null, organization?: string | null, url?: string | null, con_mail_destination?: string | null, can_play_concurrently: boolean, short_blurb?: string | null, participant_communications?: string | null, content_warnings?: string | null, email?: string | null, length_seconds: number, status?: string | null, description_html?: string | null, current_user_form_item_viewer_role: Types.FormItemRole, current_user_form_item_writer_role: Types.FormItemRole, admin_notes?: string | null, event_category: { __typename: 'EventCategory', id: string }, registration_policy?: { __typename: 'RegistrationPolicy', slots_limited?: boolean | null, prevent_no_preference_signups: boolean, buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, name?: string | null, description?: string | null, minimum_slots?: number | null, preferred_slots?: number | null, total_slots?: number | null, slots_limited: boolean, anything: boolean, not_counted: boolean }> } | null, runs: Array<{ __typename: 'Run', id: string, starts_at: string, schedule_note?: string | null, title_suffix?: string | null, room_names: Array<string>, confirmed_signup_count: number, not_counted_signup_count: number, grouped_signup_counts: Array<{ __typename: 'GroupedSignupCount', bucket_key?: string | null, count: number, counted: boolean, state: Types.SignupState, team_member: boolean }>, rooms: Array<{ __typename: 'Room', id: string, name?: string | null }>, my_signups: Array<{ __typename: 'Signup', id: string, state: Types.SignupState }>, my_signup_requests: Array<{ __typename: 'SignupRequest', id: string, state: Types.SignupRequestState }> }>, maximum_event_provided_tickets_overrides: Array<{ __typename: 'MaximumEventProvidedTicketsOverride', id: string, override_value: number, ticket_type: { __typename: 'TicketType', id: string, description?: string | null, maximum_event_provided_tickets: number } }>, images: Array<{ __typename: 'ActiveStorageAttachment', id: string, byte_size: number, content_type: string, filename: string, url: string }> }>, event_categories: Array<{ __typename: 'EventCategory', id: string, name: string, scheduling_ui: Types.SchedulingUi, default_color?: string | null, full_color?: string | null, signed_up_color?: string | null, teamMemberNamePlural: string, team_member_name: string, event_form: { __typename: 'Form', id: string, title: string, form_type: Types.FormType, form_sections: Array<{ __typename: 'FormSection', id: string, title?: string | null, position: number, form_items: Array<{ __typename: 'FormItem', id: string, admin_description?: string | null, position: number, identifier?: string | null, item_type: string, rendered_properties: string, default_value?: string | null, visibility: Types.FormItemRole, writeability: Types.FormItemRole, expose_in?: Array<Types.FormItemExposeIn> | null }> }> } }>, rooms: Array<{ __typename: 'Room', id: string, name?: string | null }>, ticket_types: Array<{ __typename: 'TicketType', id: string, description?: string | null, maximum_event_provided_tickets: number }> } };

export const EventPageEventCategoryFieldsFragmentDoc = gql`
    fragment EventPageEventCategoryFields on EventCategory {
  id
  name
  scheduling_ui
  default_color
  full_color
  signed_up_color
  teamMemberNamePlural
  team_member_name
  event_form {
    id
    ...CommonFormFields
    form_sections {
      id
      form_items {
        id
        admin_description
      }
    }
  }
}
    ${CommonFormFieldsFragmentDoc}`;
export const RoomFieldsFragmentDoc = gql`
    fragment RoomFields on Room {
  id
  name
}
    `;
export const TicketTypeFieldsFragmentDoc = gql`
    fragment TicketTypeFields on TicketType {
  id
  description
  maximum_event_provided_tickets
}
    `;
export const ConventionFieldsFragmentDoc = gql`
    fragment ConventionFields on Convention {
  id
  name
  starts_at
  ends_at
  timezone_name
  timezone_mode
  event_mailing_list_domain
  site_mode
  signup_mode
  event_categories {
    id
    ...EventPageEventCategoryFields
  }
  rooms {
    id
    ...RoomFields
  }
  ticket_types {
    id
    ...TicketTypeFields
  }
  ticket_name
  ticket_mode
}
    ${EventPageEventCategoryFieldsFragmentDoc}
${RoomFieldsFragmentDoc}
${TicketTypeFieldsFragmentDoc}`;
export const RunFieldsFragmentDoc = gql`
    fragment RunFields on Run {
  id
  starts_at
  schedule_note
  title_suffix
  room_names
  confirmed_signup_count
  not_counted_signup_count
  grouped_signup_counts {
    bucket_key
    count
    counted
    state
    team_member
  }
  rooms {
    id
    ...RoomFields
  }
  my_signups {
    id
    state
  }
  my_signup_requests {
    id
    state
  }
}
    ${RoomFieldsFragmentDoc}`;
export const MaximumEventProvidedTicketsOverrideFieldsFragmentDoc = gql`
    fragment MaximumEventProvidedTicketsOverrideFields on MaximumEventProvidedTicketsOverride {
  ticket_type {
    id
    ...TicketTypeFields
  }
  id
  override_value
}
    ${TicketTypeFieldsFragmentDoc}`;
export const EventFieldsFragmentDoc = gql`
    fragment EventFields on Event {
  id
  title
  author
  description
  organization
  url
  con_mail_destination
  can_play_concurrently
  short_blurb
  participant_communications
  content_warnings
  email
  length_seconds
  status
  description_html
  current_user_form_item_viewer_role
  current_user_form_item_writer_role
  admin_notes
  event_category {
    id
  }
  registration_policy {
    buckets {
      key
      name
      description
      minimum_slots
      preferred_slots
      total_slots
      slots_limited
      anything
      not_counted
    }
    slots_limited
    prevent_no_preference_signups
  }
  runs {
    id
    ...RunFields
  }
  maximum_event_provided_tickets_overrides {
    id
    ...MaximumEventProvidedTicketsOverrideFields
  }
  images {
    id
    byte_size
    content_type
    filename
    url
  }
}
    ${RunFieldsFragmentDoc}
${MaximumEventProvidedTicketsOverrideFieldsFragmentDoc}`;
export const EventAdminSingleEventQueryDocument = gql`
    query EventAdminSingleEventQuery($eventId: ID!) {
  conventionByRequestHost {
    id
    event(id: $eventId) {
      id
      form_response_attrs_json
      ...EventFields
    }
  }
}
    ${EventFieldsFragmentDoc}`;

/**
 * __useEventAdminSingleEventQuery__
 *
 * To run a query within a React component, call `useEventAdminSingleEventQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventAdminSingleEventQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventAdminSingleEventQuery({
 *   variables: {
 *      eventId: // value for 'eventId'
 *   },
 * });
 */
export function useEventAdminSingleEventQuery(baseOptions: Apollo.QueryHookOptions<EventAdminSingleEventQueryData, EventAdminSingleEventQueryVariables> & ({ variables: EventAdminSingleEventQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EventAdminSingleEventQueryData, EventAdminSingleEventQueryVariables>(EventAdminSingleEventQueryDocument, options);
      }
export function useEventAdminSingleEventQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventAdminSingleEventQueryData, EventAdminSingleEventQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EventAdminSingleEventQueryData, EventAdminSingleEventQueryVariables>(EventAdminSingleEventQueryDocument, options);
        }
export function useEventAdminSingleEventQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<EventAdminSingleEventQueryData, EventAdminSingleEventQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<EventAdminSingleEventQueryData, EventAdminSingleEventQueryVariables>(EventAdminSingleEventQueryDocument, options);
        }
export type EventAdminSingleEventQueryHookResult = ReturnType<typeof useEventAdminSingleEventQuery>;
export type EventAdminSingleEventQueryLazyQueryHookResult = ReturnType<typeof useEventAdminSingleEventQueryLazyQuery>;
export type EventAdminSingleEventQuerySuspenseQueryHookResult = ReturnType<typeof useEventAdminSingleEventQuerySuspenseQuery>;
export type EventAdminSingleEventQueryQueryResult = Apollo.QueryResult<EventAdminSingleEventQueryData, EventAdminSingleEventQueryVariables>;
export const EventAdminEventsQueryDocument = gql`
    query EventAdminEventsQuery {
  currentAbility {
    can_override_maximum_event_provided_tickets
    can_manage_runs
  }
  convention: conventionByRequestHost {
    id
    ...ConventionFields
    events(includeDropped: true) {
      id
      ...EventFields
    }
  }
}
    ${ConventionFieldsFragmentDoc}
${EventFieldsFragmentDoc}`;

/**
 * __useEventAdminEventsQuery__
 *
 * To run a query within a React component, call `useEventAdminEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventAdminEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventAdminEventsQuery({
 *   variables: {
 *   },
 * });
 */
export function useEventAdminEventsQuery(baseOptions?: Apollo.QueryHookOptions<EventAdminEventsQueryData, EventAdminEventsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EventAdminEventsQueryData, EventAdminEventsQueryVariables>(EventAdminEventsQueryDocument, options);
      }
export function useEventAdminEventsQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventAdminEventsQueryData, EventAdminEventsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EventAdminEventsQueryData, EventAdminEventsQueryVariables>(EventAdminEventsQueryDocument, options);
        }
export function useEventAdminEventsQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<EventAdminEventsQueryData, EventAdminEventsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<EventAdminEventsQueryData, EventAdminEventsQueryVariables>(EventAdminEventsQueryDocument, options);
        }
export type EventAdminEventsQueryHookResult = ReturnType<typeof useEventAdminEventsQuery>;
export type EventAdminEventsQueryLazyQueryHookResult = ReturnType<typeof useEventAdminEventsQueryLazyQuery>;
export type EventAdminEventsQuerySuspenseQueryHookResult = ReturnType<typeof useEventAdminEventsQuerySuspenseQuery>;
export type EventAdminEventsQueryQueryResult = Apollo.QueryResult<EventAdminEventsQueryData, EventAdminEventsQueryVariables>;