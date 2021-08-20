/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { CommonFormFieldsFragment, CommonFormSectionFieldsFragment, CommonFormItemFieldsFragment } from '../Models/commonFormFragments.generated';
import { gql } from '@apollo/client';
import { CommonFormFieldsFragmentDoc, CommonFormSectionFieldsFragmentDoc, CommonFormItemFieldsFragmentDoc } from '../Models/commonFormFragments.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type TicketTypeFieldsFragment = (
  { __typename: 'TicketType' }
  & Pick<Types.TicketType, 'id' | 'description' | 'maximum_event_provided_tickets'>
);

export type MaximumEventProvidedTicketsOverrideFieldsFragment = (
  { __typename: 'MaximumEventProvidedTicketsOverride' }
  & Pick<Types.MaximumEventProvidedTicketsOverride, 'id' | 'override_value'>
  & { ticket_type: (
    { __typename: 'TicketType' }
    & Pick<Types.TicketType, 'id'>
    & TicketTypeFieldsFragment
  ) }
);

export type RoomFieldsFragment = (
  { __typename: 'Room' }
  & Pick<Types.Room, 'id' | 'name'>
);

export type EventPageEventCategoryFieldsFragment = (
  { __typename: 'EventCategory' }
  & Pick<Types.EventCategory, 'id' | 'name' | 'scheduling_ui' | 'default_color' | 'full_color' | 'signed_up_color'>
  & { event_form: (
    { __typename: 'Form' }
    & Pick<Types.Form, 'id'>
    & { form_sections: Array<(
      { __typename: 'FormSection' }
      & Pick<Types.FormSection, 'id'>
      & { form_items: Array<(
        { __typename: 'FormItem' }
        & Pick<Types.FormItem, 'id' | 'admin_description'>
      )> }
    )> }
    & CommonFormFieldsFragment
  ) }
);

export type ConventionFieldsFragment = (
  { __typename: 'Convention' }
  & Pick<Types.Convention, 'id' | 'name' | 'starts_at' | 'ends_at' | 'timezone_name' | 'timezone_mode' | 'event_mailing_list_domain' | 'site_mode' | 'ticket_name' | 'ticket_mode'>
  & { event_categories: Array<(
    { __typename: 'EventCategory' }
    & Pick<Types.EventCategory, 'id'>
    & EventPageEventCategoryFieldsFragment
  )>, rooms: Array<(
    { __typename: 'Room' }
    & Pick<Types.Room, 'id'>
    & RoomFieldsFragment
  )>, ticket_types: Array<(
    { __typename: 'TicketType' }
    & Pick<Types.TicketType, 'id'>
    & TicketTypeFieldsFragment
  )> }
);

export type RunFieldsFragment = (
  { __typename: 'Run' }
  & Pick<Types.Run, 'id' | 'starts_at' | 'schedule_note' | 'title_suffix' | 'room_names' | 'confirmed_signup_count' | 'not_counted_signup_count' | 'signup_count_by_state_and_bucket_key_and_counted'>
  & { rooms: Array<(
    { __typename: 'Room' }
    & Pick<Types.Room, 'id'>
    & RoomFieldsFragment
  )>, my_signups: Array<(
    { __typename: 'Signup' }
    & Pick<Types.Signup, 'id' | 'state'>
  )>, my_signup_requests: Array<(
    { __typename: 'SignupRequest' }
    & Pick<Types.SignupRequest, 'id' | 'state'>
  )> }
);

export type EventFieldsFragment = (
  { __typename: 'Event' }
  & Pick<Types.Event, 'id' | 'title' | 'author' | 'description' | 'organization' | 'url' | 'con_mail_destination' | 'can_play_concurrently' | 'short_blurb' | 'participant_communications' | 'age_restrictions' | 'content_warnings' | 'email' | 'length_seconds' | 'status' | 'description_html' | 'form_response_attrs_json' | 'current_user_form_item_viewer_role' | 'current_user_form_item_writer_role' | 'admin_notes'>
  & { event_category: (
    { __typename: 'EventCategory' }
    & Pick<Types.EventCategory, 'id' | 'name'>
  ), registration_policy?: Types.Maybe<(
    { __typename: 'RegistrationPolicy' }
    & Pick<Types.RegistrationPolicy, 'slots_limited' | 'prevent_no_preference_signups'>
    & { buckets: Array<(
      { __typename: 'RegistrationPolicyBucket' }
      & Pick<Types.RegistrationPolicyBucket, 'key' | 'name' | 'description' | 'minimum_slots' | 'preferred_slots' | 'total_slots' | 'slots_limited' | 'anything' | 'not_counted'>
    )> }
  )>, runs: Array<(
    { __typename: 'Run' }
    & Pick<Types.Run, 'id'>
    & RunFieldsFragment
  )>, maximum_event_provided_tickets_overrides: Array<(
    { __typename: 'MaximumEventProvidedTicketsOverride' }
    & Pick<Types.MaximumEventProvidedTicketsOverride, 'id'>
    & MaximumEventProvidedTicketsOverrideFieldsFragment
  )> }
);

export type EventAdminEventsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type EventAdminEventsQueryData = (
  { __typename: 'Query' }
  & { currentAbility: (
    { __typename: 'Ability' }
    & Pick<Types.Ability, 'can_override_maximum_event_provided_tickets' | 'can_manage_runs'>
  ), convention: (
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & ConventionFieldsFragment
  ), events: Array<(
    { __typename: 'Event' }
    & Pick<Types.Event, 'id'>
    & EventFieldsFragment
  )> }
);

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
  convention: assertConvention {
    id
    ...ConventionFields
  }
  events(includeDropped: true) {
    id
    ...EventFields
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