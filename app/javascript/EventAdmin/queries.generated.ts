/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { CommonFormFieldsFragmentDoc, CommonFormSectionFieldsFragmentDoc, CommonFormItemFieldsFragmentDoc } from '../Models/commonFormFragments.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type TicketTypeFieldsFragment = { __typename: 'TicketType', description?: string | null | undefined, maximum_event_provided_tickets: number, id: string };

export type MaximumEventProvidedTicketsOverrideFieldsFragment = { __typename: 'MaximumEventProvidedTicketsOverride', override_value: number, id: string, ticket_type: { __typename: 'TicketType', description?: string | null | undefined, maximum_event_provided_tickets: number, id: string } };

export type RoomFieldsFragment = { __typename: 'Room', name?: string | null | undefined, id: string };

export type EventPageEventCategoryFieldsFragment = { __typename: 'EventCategory', name: string, scheduling_ui: Types.SchedulingUi, default_color?: string | null | undefined, full_color?: string | null | undefined, signed_up_color?: string | null | undefined, id: string, event_form: { __typename: 'Form', title: string, form_type: Types.FormType, id: string, form_sections: Array<{ __typename: 'FormSection', title?: string | null | undefined, position: number, id: string, form_items: Array<{ __typename: 'FormItem', admin_description?: string | null | undefined, position: number, identifier?: string | null | undefined, item_type: string, rendered_properties?: any | null | undefined, default_value?: any | null | undefined, visibility: Types.FormItemRole, writeability: Types.FormItemRole, id: string }> }> } };

export type ConventionFieldsFragment = { __typename: 'Convention', name: string, starts_at?: any | null | undefined, ends_at?: any | null | undefined, timezone_name?: string | null | undefined, timezone_mode: Types.TimezoneMode, event_mailing_list_domain?: string | null | undefined, site_mode: Types.SiteMode, ticket_name: string, ticket_mode: Types.TicketMode, id: string, event_categories: Array<{ __typename: 'EventCategory', name: string, scheduling_ui: Types.SchedulingUi, default_color?: string | null | undefined, full_color?: string | null | undefined, signed_up_color?: string | null | undefined, id: string, event_form: { __typename: 'Form', title: string, form_type: Types.FormType, id: string, form_sections: Array<{ __typename: 'FormSection', title?: string | null | undefined, position: number, id: string, form_items: Array<{ __typename: 'FormItem', admin_description?: string | null | undefined, position: number, identifier?: string | null | undefined, item_type: string, rendered_properties?: any | null | undefined, default_value?: any | null | undefined, visibility: Types.FormItemRole, writeability: Types.FormItemRole, id: string }> }> } }>, rooms: Array<{ __typename: 'Room', name?: string | null | undefined, id: string }>, ticket_types: Array<{ __typename: 'TicketType', description?: string | null | undefined, maximum_event_provided_tickets: number, id: string }> };

export type RunFieldsFragment = { __typename: 'Run', starts_at: any, schedule_note?: string | null | undefined, title_suffix?: string | null | undefined, room_names: Array<string>, confirmed_signup_count: number, not_counted_signup_count: number, signup_count_by_state_and_bucket_key_and_counted: any, id: string, rooms: Array<{ __typename: 'Room', name?: string | null | undefined, id: string }>, my_signups: Array<{ __typename: 'Signup', state: Types.SignupState, id: string }>, my_signup_requests: Array<{ __typename: 'SignupRequest', state: Types.SignupRequestState, id: string }> };

export type EventFieldsFragment = { __typename: 'Event', title?: string | null | undefined, author?: string | null | undefined, description?: string | null | undefined, organization?: string | null | undefined, url?: string | null | undefined, con_mail_destination?: string | null | undefined, can_play_concurrently: boolean, short_blurb?: string | null | undefined, participant_communications?: string | null | undefined, age_restrictions?: string | null | undefined, content_warnings?: string | null | undefined, email?: string | null | undefined, length_seconds: number, status?: string | null | undefined, description_html?: string | null | undefined, form_response_attrs_json?: any | null | undefined, current_user_form_item_viewer_role: Types.FormItemRole, current_user_form_item_writer_role: Types.FormItemRole, admin_notes?: string | null | undefined, id: string, event_category: { __typename: 'EventCategory', name: string, id: string }, registration_policy?: { __typename: 'RegistrationPolicy', slots_limited?: boolean | null | undefined, prevent_no_preference_signups: boolean, buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, name?: string | null | undefined, description?: string | null | undefined, minimum_slots?: number | null | undefined, preferred_slots?: number | null | undefined, total_slots?: number | null | undefined, slots_limited: boolean, anything: boolean, not_counted: boolean }> } | null | undefined, runs: Array<{ __typename: 'Run', starts_at: any, schedule_note?: string | null | undefined, title_suffix?: string | null | undefined, room_names: Array<string>, confirmed_signup_count: number, not_counted_signup_count: number, signup_count_by_state_and_bucket_key_and_counted: any, id: string, rooms: Array<{ __typename: 'Room', name?: string | null | undefined, id: string }>, my_signups: Array<{ __typename: 'Signup', state: Types.SignupState, id: string }>, my_signup_requests: Array<{ __typename: 'SignupRequest', state: Types.SignupRequestState, id: string }> }>, maximum_event_provided_tickets_overrides: Array<{ __typename: 'MaximumEventProvidedTicketsOverride', override_value: number, id: string, ticket_type: { __typename: 'TicketType', description?: string | null | undefined, maximum_event_provided_tickets: number, id: string } }> };

export type EventAdminEventsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type EventAdminEventsQueryData = { __typename: 'Query', currentAbility: { __typename: 'Ability', can_override_maximum_event_provided_tickets: boolean, can_manage_runs: boolean }, convention: { __typename: 'Convention', name: string, starts_at?: any | null | undefined, ends_at?: any | null | undefined, timezone_name?: string | null | undefined, timezone_mode: Types.TimezoneMode, event_mailing_list_domain?: string | null | undefined, site_mode: Types.SiteMode, ticket_name: string, ticket_mode: Types.TicketMode, id: string, events: Array<{ __typename: 'Event', title?: string | null | undefined, author?: string | null | undefined, description?: string | null | undefined, organization?: string | null | undefined, url?: string | null | undefined, con_mail_destination?: string | null | undefined, can_play_concurrently: boolean, short_blurb?: string | null | undefined, participant_communications?: string | null | undefined, age_restrictions?: string | null | undefined, content_warnings?: string | null | undefined, email?: string | null | undefined, length_seconds: number, status?: string | null | undefined, description_html?: string | null | undefined, form_response_attrs_json?: any | null | undefined, current_user_form_item_viewer_role: Types.FormItemRole, current_user_form_item_writer_role: Types.FormItemRole, admin_notes?: string | null | undefined, id: string, event_category: { __typename: 'EventCategory', name: string, id: string }, registration_policy?: { __typename: 'RegistrationPolicy', slots_limited?: boolean | null | undefined, prevent_no_preference_signups: boolean, buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, name?: string | null | undefined, description?: string | null | undefined, minimum_slots?: number | null | undefined, preferred_slots?: number | null | undefined, total_slots?: number | null | undefined, slots_limited: boolean, anything: boolean, not_counted: boolean }> } | null | undefined, runs: Array<{ __typename: 'Run', starts_at: any, schedule_note?: string | null | undefined, title_suffix?: string | null | undefined, room_names: Array<string>, confirmed_signup_count: number, not_counted_signup_count: number, signup_count_by_state_and_bucket_key_and_counted: any, id: string, rooms: Array<{ __typename: 'Room', name?: string | null | undefined, id: string }>, my_signups: Array<{ __typename: 'Signup', state: Types.SignupState, id: string }>, my_signup_requests: Array<{ __typename: 'SignupRequest', state: Types.SignupRequestState, id: string }> }>, maximum_event_provided_tickets_overrides: Array<{ __typename: 'MaximumEventProvidedTicketsOverride', override_value: number, id: string, ticket_type: { __typename: 'TicketType', description?: string | null | undefined, maximum_event_provided_tickets: number, id: string } }> }>, event_categories: Array<{ __typename: 'EventCategory', name: string, scheduling_ui: Types.SchedulingUi, default_color?: string | null | undefined, full_color?: string | null | undefined, signed_up_color?: string | null | undefined, id: string, event_form: { __typename: 'Form', title: string, form_type: Types.FormType, id: string, form_sections: Array<{ __typename: 'FormSection', title?: string | null | undefined, position: number, id: string, form_items: Array<{ __typename: 'FormItem', admin_description?: string | null | undefined, position: number, identifier?: string | null | undefined, item_type: string, rendered_properties?: any | null | undefined, default_value?: any | null | undefined, visibility: Types.FormItemRole, writeability: Types.FormItemRole, id: string }> }> } }>, rooms: Array<{ __typename: 'Room', name?: string | null | undefined, id: string }>, ticket_types: Array<{ __typename: 'TicketType', description?: string | null | undefined, maximum_event_provided_tickets: number, id: string }> } };

export const EventPageEventCategoryFieldsFragmentDoc = gql`
    fragment EventPageEventCategoryFields on EventCategory {
  id: transitionalId
  name
  scheduling_ui
  default_color
  full_color
  signed_up_color
  event_form {
    id: transitionalId
    ...CommonFormFields
    form_sections {
      id: transitionalId
      form_items {
        id: transitionalId
        admin_description
      }
    }
  }
}
    ${CommonFormFieldsFragmentDoc}`;
export const RoomFieldsFragmentDoc = gql`
    fragment RoomFields on Room {
  id: transitionalId
  name
}
    `;
export const TicketTypeFieldsFragmentDoc = gql`
    fragment TicketTypeFields on TicketType {
  id: transitionalId
  description
  maximum_event_provided_tickets
}
    `;
export const ConventionFieldsFragmentDoc = gql`
    fragment ConventionFields on Convention {
  id: transitionalId
  name
  starts_at
  ends_at
  timezone_name
  timezone_mode
  event_mailing_list_domain
  site_mode
  event_categories {
    id: transitionalId
    ...EventPageEventCategoryFields
  }
  rooms {
    id: transitionalId
    ...RoomFields
  }
  ticket_types {
    id: transitionalId
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
  id: transitionalId
  starts_at
  schedule_note
  title_suffix
  room_names
  confirmed_signup_count
  not_counted_signup_count
  signup_count_by_state_and_bucket_key_and_counted
  rooms {
    id: transitionalId
    ...RoomFields
  }
  my_signups {
    id: transitionalId
    state
  }
  my_signup_requests {
    id: transitionalId
    state
  }
}
    ${RoomFieldsFragmentDoc}`;
export const MaximumEventProvidedTicketsOverrideFieldsFragmentDoc = gql`
    fragment MaximumEventProvidedTicketsOverrideFields on MaximumEventProvidedTicketsOverride {
  ticket_type {
    id: transitionalId
    ...TicketTypeFields
  }
  id: transitionalId
  override_value
}
    ${TicketTypeFieldsFragmentDoc}`;
export const EventFieldsFragmentDoc = gql`
    fragment EventFields on Event {
  id: transitionalId
  title
  author
  description
  organization
  url
  con_mail_destination
  can_play_concurrently
  short_blurb
  participant_communications
  age_restrictions
  content_warnings
  email
  length_seconds
  status
  description_html
  form_response_attrs_json
  current_user_form_item_viewer_role
  current_user_form_item_writer_role
  admin_notes
  event_category {
    id: transitionalId
    name
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
    id: transitionalId
    ...RunFields
  }
  maximum_event_provided_tickets_overrides {
    id: transitionalId
    ...MaximumEventProvidedTicketsOverrideFields
  }
}
    ${RunFieldsFragmentDoc}
${MaximumEventProvidedTicketsOverrideFieldsFragmentDoc}`;
export const EventAdminEventsQueryDocument = gql`
    query EventAdminEventsQuery {
  currentAbility {
    can_override_maximum_event_provided_tickets
    can_manage_runs
  }
  convention: conventionByRequestHost {
    id: transitionalId
    ...ConventionFields
    events(includeDropped: true) {
      id: transitionalId
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
export type EventAdminEventsQueryHookResult = ReturnType<typeof useEventAdminEventsQuery>;
export type EventAdminEventsQueryLazyQueryHookResult = ReturnType<typeof useEventAdminEventsQueryLazyQuery>;
export type EventAdminEventsQueryQueryResult = Apollo.QueryResult<EventAdminEventsQueryData, EventAdminEventsQueryVariables>;