/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };


export type TicketTypeFieldsFragment = (
  { __typename?: 'TicketType' }
  & Pick<Types.TicketType, 'id' | 'description' | 'maximum_event_provided_tickets'>
);

export type MaximumEventProvidedTicketsOverrideFieldsFragment = (
  { __typename?: 'MaximumEventProvidedTicketsOverride' }
  & Pick<Types.MaximumEventProvidedTicketsOverride, 'id' | 'override_value'>
  & { ticket_type: (
    { __typename?: 'TicketType' }
    & Pick<Types.TicketType, 'id'>
    & TicketTypeFieldsFragment
  ) }
);

export type RoomFieldsFragment = (
  { __typename?: 'Room' }
  & Pick<Types.Room, 'id' | 'name'>
);

export type ConventionFieldsFragment = (
  { __typename?: 'Convention' }
  & Pick<Types.Convention, 'id' | 'name' | 'starts_at' | 'ends_at' | 'timezone_name' | 'timezone_mode' | 'event_mailing_list_domain' | 'site_mode' | 'ticket_name' | 'ticket_mode'>
  & { event_categories: Array<(
    { __typename?: 'EventCategory' }
    & Pick<Types.EventCategory, 'id'>
    & EventPageEventCategoryFieldsFragment
  )>, rooms?: Types.Maybe<Array<(
    { __typename?: 'Room' }
    & Pick<Types.Room, 'id'>
    & RoomFieldsFragment
  )>>, ticket_types?: Types.Maybe<Array<(
    { __typename?: 'TicketType' }
    & Pick<Types.TicketType, 'id'>
    & TicketTypeFieldsFragment
  )>> }
);

export type RunFieldsFragment = (
  { __typename?: 'Run' }
  & Pick<Types.Run, 'id' | 'starts_at' | 'schedule_note' | 'title_suffix'>
  & { rooms: Array<(
    { __typename?: 'Room' }
    & Pick<Types.Room, 'id'>
    & RoomFieldsFragment
  )> }
);

export type EventFieldsFragment = (
  { __typename?: 'Event' }
  & Pick<Types.Event, 'id' | 'title' | 'author' | 'description' | 'organization' | 'url' | 'con_mail_destination' | 'can_play_concurrently' | 'short_blurb' | 'participant_communications' | 'age_restrictions' | 'content_warnings' | 'email' | 'length_seconds' | 'status' | 'description_html' | 'form_response_attrs_json' | 'admin_notes'>
  & { event_category: (
    { __typename?: 'EventCategory' }
    & Pick<Types.EventCategory, 'id'>
  ), registration_policy?: Types.Maybe<(
    { __typename?: 'RegistrationPolicy' }
    & Pick<Types.RegistrationPolicy, 'slots_limited' | 'prevent_no_preference_signups'>
    & { buckets: Array<(
      { __typename?: 'RegistrationPolicyBucket' }
      & Pick<Types.RegistrationPolicyBucket, 'key' | 'name' | 'description' | 'minimum_slots' | 'preferred_slots' | 'total_slots' | 'slots_limited' | 'anything'>
    )> }
  )>, runs: Array<(
    { __typename?: 'Run' }
    & Pick<Types.Run, 'id'>
    & RunFieldsFragment
  )>, maximum_event_provided_tickets_overrides: Array<(
    { __typename?: 'MaximumEventProvidedTicketsOverride' }
    & Pick<Types.MaximumEventProvidedTicketsOverride, 'id'>
    & MaximumEventProvidedTicketsOverrideFieldsFragment
  )> }
);

export type EventPageEventCategoryFieldsFragment = (
  { __typename?: 'EventCategory' }
  & Pick<Types.EventCategory, 'id' | 'name' | 'scheduling_ui' | 'default_color' | 'full_color' | 'signed_up_color'>
  & { event_form: (
    { __typename?: 'Form' }
    & Pick<Types.Form, 'id' | 'form_api_json'>
  ) }
);

export type EventAdminEventsQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type EventAdminEventsQueryQuery = (
  { __typename?: 'Query' }
  & { currentAbility: (
    { __typename?: 'Ability' }
    & Pick<Types.Ability, 'can_override_maximum_event_provided_tickets' | 'can_manage_runs'>
  ), convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & ConventionFieldsFragment
  )>, events: Array<(
    { __typename?: 'Event' }
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
    form_api_json
  }
}
    `;
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
  rooms {
    id
    ...RoomFields
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
  convention {
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
 * __useEventAdminEventsQueryQuery__
 *
 * To run a query within a React component, call `useEventAdminEventsQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventAdminEventsQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventAdminEventsQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useEventAdminEventsQueryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<EventAdminEventsQueryQuery, EventAdminEventsQueryQueryVariables>) {
        return ApolloReactHooks.useQuery<EventAdminEventsQueryQuery, EventAdminEventsQueryQueryVariables>(EventAdminEventsQueryDocument, baseOptions);
      }
export function useEventAdminEventsQueryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<EventAdminEventsQueryQuery, EventAdminEventsQueryQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<EventAdminEventsQueryQuery, EventAdminEventsQueryQueryVariables>(EventAdminEventsQueryDocument, baseOptions);
        }
export type EventAdminEventsQueryQueryHookResult = ReturnType<typeof useEventAdminEventsQueryQuery>;
export type EventAdminEventsQueryLazyQueryHookResult = ReturnType<typeof useEventAdminEventsQueryLazyQuery>;
export type EventAdminEventsQueryQueryResult = ApolloReactCommon.QueryResult<EventAdminEventsQueryQuery, EventAdminEventsQueryQueryVariables>;