/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { CommonFormFieldsFragmentDoc, CommonFormSectionFieldsFragmentDoc, CommonFormItemFieldsFragmentDoc } from '../Models/commonFormFragments.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type TicketTypeFieldsFragment = { __typename: 'TicketType', id: number, description?: string | null | undefined, maximum_event_provided_tickets: number };

export type MaximumEventProvidedTicketsOverrideFieldsFragment = { __typename: 'MaximumEventProvidedTicketsOverride', id: number, override_value: number, ticket_type: { __typename: 'TicketType', id: number, description?: string | null | undefined, maximum_event_provided_tickets: number } };

export type RoomFieldsFragment = { __typename: 'Room', id: number, name?: string | null | undefined };

export type EventPageEventCategoryFieldsFragment = { __typename: 'EventCategory', id: number, name: string, scheduling_ui: Types.SchedulingUi, default_color?: string | null | undefined, full_color?: string | null | undefined, signed_up_color?: string | null | undefined, event_form: { __typename: 'Form', id: number, title: string, form_type: Types.FormType, form_sections: Array<{ __typename: 'FormSection', id: number, title?: string | null | undefined, position: number, form_items: Array<{ __typename: 'FormItem', id: number, admin_description?: string | null | undefined, position: number, identifier?: string | null | undefined, item_type: string, rendered_properties?: any | null | undefined, default_value?: any | null | undefined, visibility: Types.FormItemRole, writeability: Types.FormItemRole }> }> } };

export type ConventionFieldsFragment = { __typename: 'Convention', id: number, name: string, starts_at?: any | null | undefined, ends_at?: any | null | undefined, timezone_name?: string | null | undefined, timezone_mode: Types.TimezoneMode, event_mailing_list_domain?: string | null | undefined, site_mode: Types.SiteMode, ticket_name: string, ticket_mode: Types.TicketMode, event_categories: Array<{ __typename: 'EventCategory', id: number, name: string, scheduling_ui: Types.SchedulingUi, default_color?: string | null | undefined, full_color?: string | null | undefined, signed_up_color?: string | null | undefined, event_form: { __typename: 'Form', id: number, title: string, form_type: Types.FormType, form_sections: Array<{ __typename: 'FormSection', id: number, title?: string | null | undefined, position: number, form_items: Array<{ __typename: 'FormItem', id: number, admin_description?: string | null | undefined, position: number, identifier?: string | null | undefined, item_type: string, rendered_properties?: any | null | undefined, default_value?: any | null | undefined, visibility: Types.FormItemRole, writeability: Types.FormItemRole }> }> } }>, rooms: Array<{ __typename: 'Room', id: number, name?: string | null | undefined }>, ticket_types: Array<{ __typename: 'TicketType', id: number, description?: string | null | undefined, maximum_event_provided_tickets: number }> };

export type RunFieldsFragment = { __typename: 'Run', id: number, starts_at: any, schedule_note?: string | null | undefined, title_suffix?: string | null | undefined, room_names: Array<string>, confirmed_signup_count: number, not_counted_signup_count: number, signup_count_by_state_and_bucket_key_and_counted: any, rooms: Array<{ __typename: 'Room', id: number, name?: string | null | undefined }>, my_signups: Array<{ __typename: 'Signup', id: number, state: Types.SignupState }>, my_signup_requests: Array<{ __typename: 'SignupRequest', id: number, state: Types.SignupRequestState }> };

export type EventFieldsFragment = { __typename: 'Event', id: number, title?: string | null | undefined, author?: string | null | undefined, description?: string | null | undefined, organization?: string | null | undefined, url?: string | null | undefined, con_mail_destination?: string | null | undefined, can_play_concurrently: boolean, short_blurb?: string | null | undefined, participant_communications?: string | null | undefined, age_restrictions?: string | null | undefined, content_warnings?: string | null | undefined, email?: string | null | undefined, length_seconds: number, status?: string | null | undefined, description_html?: string | null | undefined, form_response_attrs_json?: any | null | undefined, current_user_form_item_viewer_role: Types.FormItemRole, current_user_form_item_writer_role: Types.FormItemRole, admin_notes?: string | null | undefined, event_category: { __typename: 'EventCategory', id: number, name: string }, registration_policy?: { __typename: 'RegistrationPolicy', slots_limited?: boolean | null | undefined, prevent_no_preference_signups: boolean, buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, name?: string | null | undefined, description?: string | null | undefined, minimum_slots?: number | null | undefined, preferred_slots?: number | null | undefined, total_slots?: number | null | undefined, slots_limited: boolean, anything: boolean, not_counted: boolean }> } | null | undefined, runs: Array<{ __typename: 'Run', id: number, starts_at: any, schedule_note?: string | null | undefined, title_suffix?: string | null | undefined, room_names: Array<string>, confirmed_signup_count: number, not_counted_signup_count: number, signup_count_by_state_and_bucket_key_and_counted: any, rooms: Array<{ __typename: 'Room', id: number, name?: string | null | undefined }>, my_signups: Array<{ __typename: 'Signup', id: number, state: Types.SignupState }>, my_signup_requests: Array<{ __typename: 'SignupRequest', id: number, state: Types.SignupRequestState }> }>, maximum_event_provided_tickets_overrides: Array<{ __typename: 'MaximumEventProvidedTicketsOverride', id: number, override_value: number, ticket_type: { __typename: 'TicketType', id: number, description?: string | null | undefined, maximum_event_provided_tickets: number } }> };

export type EventAdminEventsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type EventAdminEventsQueryData = { __typename: 'Query', currentAbility: { __typename: 'Ability', can_override_maximum_event_provided_tickets: boolean, can_manage_runs: boolean }, convention: { __typename: 'Convention', id: number, name: string, starts_at?: any | null | undefined, ends_at?: any | null | undefined, timezone_name?: string | null | undefined, timezone_mode: Types.TimezoneMode, event_mailing_list_domain?: string | null | undefined, site_mode: Types.SiteMode, ticket_name: string, ticket_mode: Types.TicketMode, events: Array<{ __typename: 'Event', id: number, title?: string | null | undefined, author?: string | null | undefined, description?: string | null | undefined, organization?: string | null | undefined, url?: string | null | undefined, con_mail_destination?: string | null | undefined, can_play_concurrently: boolean, short_blurb?: string | null | undefined, participant_communications?: string | null | undefined, age_restrictions?: string | null | undefined, content_warnings?: string | null | undefined, email?: string | null | undefined, length_seconds: number, status?: string | null | undefined, description_html?: string | null | undefined, form_response_attrs_json?: any | null | undefined, current_user_form_item_viewer_role: Types.FormItemRole, current_user_form_item_writer_role: Types.FormItemRole, admin_notes?: string | null | undefined, event_category: { __typename: 'EventCategory', id: number, name: string }, registration_policy?: { __typename: 'RegistrationPolicy', slots_limited?: boolean | null | undefined, prevent_no_preference_signups: boolean, buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, name?: string | null | undefined, description?: string | null | undefined, minimum_slots?: number | null | undefined, preferred_slots?: number | null | undefined, total_slots?: number | null | undefined, slots_limited: boolean, anything: boolean, not_counted: boolean }> } | null | undefined, runs: Array<{ __typename: 'Run', id: number, starts_at: any, schedule_note?: string | null | undefined, title_suffix?: string | null | undefined, room_names: Array<string>, confirmed_signup_count: number, not_counted_signup_count: number, signup_count_by_state_and_bucket_key_and_counted: any, rooms: Array<{ __typename: 'Room', id: number, name?: string | null | undefined }>, my_signups: Array<{ __typename: 'Signup', id: number, state: Types.SignupState }>, my_signup_requests: Array<{ __typename: 'SignupRequest', id: number, state: Types.SignupRequestState }> }>, maximum_event_provided_tickets_overrides: Array<{ __typename: 'MaximumEventProvidedTicketsOverride', id: number, override_value: number, ticket_type: { __typename: 'TicketType', id: number, description?: string | null | undefined, maximum_event_provided_tickets: number } }> }>, event_categories: Array<{ __typename: 'EventCategory', id: number, name: string, scheduling_ui: Types.SchedulingUi, default_color?: string | null | undefined, full_color?: string | null | undefined, signed_up_color?: string | null | undefined, event_form: { __typename: 'Form', id: number, title: string, form_type: Types.FormType, form_sections: Array<{ __typename: 'FormSection', id: number, title?: string | null | undefined, position: number, form_items: Array<{ __typename: 'FormItem', id: number, admin_description?: string | null | undefined, position: number, identifier?: string | null | undefined, item_type: string, rendered_properties?: any | null | undefined, default_value?: any | null | undefined, visibility: Types.FormItemRole, writeability: Types.FormItemRole }> }> } }>, rooms: Array<{ __typename: 'Room', id: number, name?: string | null | undefined }>, ticket_types: Array<{ __typename: 'TicketType', id: number, description?: string | null | undefined, maximum_event_provided_tickets: number }> } };

export const EventPageEventCategoryFieldsFragmentDoc = gql`
    fragment EventPageEventCategoryFields on EventCategory {
  id
  name
  scheduling_ui
  default_color
  full_color
  signed_up_color
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
  signup_count_by_state_and_bucket_key_and_counted
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
    id
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
    id
    ...RunFields
  }
  maximum_event_provided_tickets_overrides {
    id
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
export type EventAdminEventsQueryHookResult = ReturnType<typeof useEventAdminEventsQuery>;
export type EventAdminEventsQueryLazyQueryHookResult = ReturnType<typeof useEventAdminEventsQueryLazyQuery>;
export type EventAdminEventsQueryQueryResult = Apollo.QueryResult<EventAdminEventsQueryData, EventAdminEventsQueryVariables>;