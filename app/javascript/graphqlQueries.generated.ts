/* eslint-disable */
import * as Types from './graphqlTypes.generated';

import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };


export type EventPageEventCategoryFieldsFragment = (
  { __typename?: 'EventCategory' }
  & Pick<Types.EventCategory, 'id' | 'name' | 'scheduling_ui' | 'default_color' | 'full_color' | 'signed_up_color'>
  & { event_form: (
    { __typename?: 'Form' }
    & Pick<Types.Form, 'id' | 'form_api_json'>
  ) }
);

export type RoomFieldsFragment = (
  { __typename?: 'Room' }
  & Pick<Types.Room, 'id' | 'name'>
);

export type TicketTypeFieldsFragment = (
  { __typename?: 'TicketType' }
  & Pick<Types.TicketType, 'id' | 'description' | 'maximum_event_provided_tickets'>
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

export type MaximumEventProvidedTicketsOverrideFieldsFragment = (
  { __typename?: 'MaximumEventProvidedTicketsOverride' }
  & Pick<Types.MaximumEventProvidedTicketsOverride, 'id' | 'override_value'>
  & { ticket_type: (
    { __typename?: 'TicketType' }
    & Pick<Types.TicketType, 'id'>
    & TicketTypeFieldsFragment
  ) }
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

export type RunBasicSignupDataFragment = (
  { __typename?: 'Run' }
  & Pick<Types.Run, 'id' | 'signup_count_by_state_and_bucket_key_and_counted'>
  & { my_signups: Array<(
    { __typename?: 'Signup' }
    & Pick<Types.Signup, 'id' | 'state'>
  )>, my_signup_requests: Array<(
    { __typename?: 'SignupRequest' }
    & Pick<Types.SignupRequest, 'id' | 'state'>
  )> }
);

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

export type CommonConventionDataFragment = (
  { __typename?: 'Convention' }
  & Pick<Types.Convention, 'id' | 'name' | 'starts_at' | 'ends_at' | 'site_mode' | 'timezone_name' | 'timezone_mode' | 'ticket_name' | 'ticket_mode'>
  & { event_categories: Array<(
    { __typename?: 'EventCategory' }
    & Pick<Types.EventCategory, 'id' | 'name' | 'scheduling_ui' | 'default_color' | 'full_color' | 'signed_up_color'>
  )> }
);

export type CreateEventMutationVariables = Exact<{
  input: Types.CreateEventInput;
}>;


export type CreateEventMutation = (
  { __typename?: 'Mutation' }
  & { createEvent?: Types.Maybe<(
    { __typename?: 'CreateEventPayload' }
    & { event: (
      { __typename?: 'Event' }
      & Pick<Types.Event, 'id'>
      & EventFieldsFragment
    ) }
  )> }
);

export type CreateFillerEventMutationVariables = Exact<{
  input: Types.CreateFillerEventInput;
}>;


export type CreateFillerEventMutation = (
  { __typename?: 'Mutation' }
  & { createFillerEvent?: Types.Maybe<(
    { __typename?: 'CreateFillerEventPayload' }
    & { event: (
      { __typename?: 'Event' }
      & Pick<Types.Event, 'id'>
      & EventFieldsFragment
    ) }
  )> }
);

export type DropEventMutationVariables = Exact<{
  input: Types.DropEventInput;
}>;


export type DropEventMutation = (
  { __typename?: 'Mutation' }
  & { dropEvent?: Types.Maybe<(
    { __typename?: 'DropEventPayload' }
    & { event: (
      { __typename?: 'Event' }
      & Pick<Types.Event, 'id' | 'status'>
    ) }
  )> }
);

export type RestoreDroppedEventMutationVariables = Exact<{
  input: Types.RestoreDroppedEventInput;
}>;


export type RestoreDroppedEventMutation = (
  { __typename?: 'Mutation' }
  & { restoreDroppedEvent?: Types.Maybe<(
    { __typename?: 'RestoreDroppedEventPayload' }
    & { event: (
      { __typename?: 'Event' }
      & Pick<Types.Event, 'id' | 'status'>
    ) }
  )> }
);

export type UpdateEventMutationVariables = Exact<{
  input: Types.UpdateEventInput;
}>;


export type UpdateEventMutation = (
  { __typename?: 'Mutation' }
  & { updateEvent?: Types.Maybe<(
    { __typename?: 'UpdateEventPayload' }
    & { event: (
      { __typename?: 'Event' }
      & Pick<Types.Event, 'id'>
      & EventFieldsFragment
    ) }
  )> }
);

export type CreateRunMutationVariables = Exact<{
  input: Types.CreateRunInput;
}>;


export type CreateRunMutation = (
  { __typename?: 'Mutation' }
  & { createRun?: Types.Maybe<(
    { __typename?: 'CreateRunPayload' }
    & { run: (
      { __typename?: 'Run' }
      & Pick<Types.Run, 'id'>
      & RunFieldsFragment
    ) }
  )> }
);

export type CreateMultipleRunsMutationVariables = Exact<{
  input: Types.CreateMultipleRunsInput;
}>;


export type CreateMultipleRunsMutation = (
  { __typename?: 'Mutation' }
  & { createMultipleRuns?: Types.Maybe<(
    { __typename?: 'CreateMultipleRunsPayload' }
    & { runs: Array<(
      { __typename?: 'Run' }
      & Pick<Types.Run, 'id'>
      & RunFieldsFragment
    )> }
  )> }
);

export type UpdateRunMutationVariables = Exact<{
  input: Types.UpdateRunInput;
}>;


export type UpdateRunMutation = (
  { __typename?: 'Mutation' }
  & { updateRun?: Types.Maybe<(
    { __typename?: 'UpdateRunPayload' }
    & { run: (
      { __typename?: 'Run' }
      & Pick<Types.Run, 'id'>
      & RunFieldsFragment
    ) }
  )> }
);

export type DeleteRunMutationVariables = Exact<{
  input: Types.DeleteRunInput;
}>;


export type DeleteRunMutation = (
  { __typename?: 'Mutation' }
  & { deleteRun?: Types.Maybe<(
    { __typename?: 'DeleteRunPayload' }
    & { run: (
      { __typename?: 'Run' }
      & Pick<Types.Run, 'id'>
      & RunFieldsFragment
    ) }
  )> }
);

export type CreateMaximumEventProvidedTicketsOverrideMutationVariables = Exact<{
  input: Types.CreateMaximumEventProvidedTicketsOverrideInput;
}>;


export type CreateMaximumEventProvidedTicketsOverrideMutation = (
  { __typename?: 'Mutation' }
  & { createMaximumEventProvidedTicketsOverride?: Types.Maybe<(
    { __typename?: 'CreateMaximumEventProvidedTicketsOverridePayload' }
    & { maximum_event_provided_tickets_override: (
      { __typename?: 'MaximumEventProvidedTicketsOverride' }
      & Pick<Types.MaximumEventProvidedTicketsOverride, 'id'>
      & MaximumEventProvidedTicketsOverrideFieldsFragment
    ) }
  )> }
);

export type DeleteMaximumEventProvidedTicketsOverrideMutationVariables = Exact<{
  input: Types.DeleteMaximumEventProvidedTicketsOverrideInput;
}>;


export type DeleteMaximumEventProvidedTicketsOverrideMutation = (
  { __typename?: 'Mutation' }
  & { deleteMaximumEventProvidedTicketsOverride?: Types.Maybe<(
    { __typename?: 'DeleteMaximumEventProvidedTicketsOverridePayload' }
    & { maximum_event_provided_tickets_override: (
      { __typename?: 'MaximumEventProvidedTicketsOverride' }
      & Pick<Types.MaximumEventProvidedTicketsOverride, 'id'>
      & MaximumEventProvidedTicketsOverrideFieldsFragment
    ) }
  )> }
);

export type UpdateMaximumEventProvidedTicketsOverrideMutationVariables = Exact<{
  input: Types.UpdateMaximumEventProvidedTicketsOverrideInput;
}>;


export type UpdateMaximumEventProvidedTicketsOverrideMutation = (
  { __typename?: 'Mutation' }
  & { updateMaximumEventProvidedTicketsOverride?: Types.Maybe<(
    { __typename?: 'UpdateMaximumEventProvidedTicketsOverridePayload' }
    & { maximum_event_provided_tickets_override: (
      { __typename?: 'MaximumEventProvidedTicketsOverride' }
      & Pick<Types.MaximumEventProvidedTicketsOverride, 'id'>
      & MaximumEventProvidedTicketsOverrideFieldsFragment
    ) }
  )> }
);

export type UpdateEventAdminNotesMutationVariables = Exact<{
  eventId: Types.Scalars['Int'];
  adminNotes: Types.Scalars['String'];
}>;


export type UpdateEventAdminNotesMutation = (
  { __typename?: 'Mutation' }
  & { updateEventAdminNotes?: Types.Maybe<(
    { __typename?: 'UpdateEventAdminNotesPayload' }
    & { event: (
      { __typename?: 'Event' }
      & Pick<Types.Event, 'id'>
      & EventFieldsFragment
    ) }
  )> }
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

export type CommonConventionDataQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type CommonConventionDataQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & CommonConventionDataFragment
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
export const RunBasicSignupDataFragmentDoc = gql`
    fragment RunBasicSignupData on Run {
  id
  signup_count_by_state_and_bucket_key_and_counted
  my_signups {
    id
    state
  }
  my_signup_requests {
    id
    state
  }
}
    `;
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
export const CommonConventionDataFragmentDoc = gql`
    fragment CommonConventionData on Convention {
  id
  name
  starts_at
  ends_at
  site_mode
  timezone_name
  timezone_mode
  ticket_name
  ticket_mode
  event_categories {
    id
    name
    scheduling_ui
    default_color
    full_color
    signed_up_color
  }
}
    `;
export const CreateEventDocument = gql`
    mutation CreateEvent($input: CreateEventInput!) {
  createEvent(input: $input) {
    event {
      id
      ...EventFields
    }
  }
}
    ${EventFieldsFragmentDoc}`;
export type CreateEventMutationFn = ApolloReactCommon.MutationFunction<CreateEventMutation, CreateEventMutationVariables>;

/**
 * __useCreateEventMutation__
 *
 * To run a mutation, you first call `useCreateEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEventMutation, { data, loading, error }] = useCreateEventMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateEventMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateEventMutation, CreateEventMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateEventMutation, CreateEventMutationVariables>(CreateEventDocument, baseOptions);
      }
export type CreateEventMutationHookResult = ReturnType<typeof useCreateEventMutation>;
export type CreateEventMutationResult = ApolloReactCommon.MutationResult<CreateEventMutation>;
export type CreateEventMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateEventMutation, CreateEventMutationVariables>;
export const CreateFillerEventDocument = gql`
    mutation CreateFillerEvent($input: CreateFillerEventInput!) {
  createFillerEvent(input: $input) {
    event {
      id
      ...EventFields
    }
  }
}
    ${EventFieldsFragmentDoc}`;
export type CreateFillerEventMutationFn = ApolloReactCommon.MutationFunction<CreateFillerEventMutation, CreateFillerEventMutationVariables>;

/**
 * __useCreateFillerEventMutation__
 *
 * To run a mutation, you first call `useCreateFillerEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateFillerEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createFillerEventMutation, { data, loading, error }] = useCreateFillerEventMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateFillerEventMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateFillerEventMutation, CreateFillerEventMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateFillerEventMutation, CreateFillerEventMutationVariables>(CreateFillerEventDocument, baseOptions);
      }
export type CreateFillerEventMutationHookResult = ReturnType<typeof useCreateFillerEventMutation>;
export type CreateFillerEventMutationResult = ApolloReactCommon.MutationResult<CreateFillerEventMutation>;
export type CreateFillerEventMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateFillerEventMutation, CreateFillerEventMutationVariables>;
export const DropEventDocument = gql`
    mutation DropEvent($input: DropEventInput!) {
  dropEvent(input: $input) {
    event {
      id
      status
    }
  }
}
    `;
export type DropEventMutationFn = ApolloReactCommon.MutationFunction<DropEventMutation, DropEventMutationVariables>;

/**
 * __useDropEventMutation__
 *
 * To run a mutation, you first call `useDropEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDropEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [dropEventMutation, { data, loading, error }] = useDropEventMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDropEventMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DropEventMutation, DropEventMutationVariables>) {
        return ApolloReactHooks.useMutation<DropEventMutation, DropEventMutationVariables>(DropEventDocument, baseOptions);
      }
export type DropEventMutationHookResult = ReturnType<typeof useDropEventMutation>;
export type DropEventMutationResult = ApolloReactCommon.MutationResult<DropEventMutation>;
export type DropEventMutationOptions = ApolloReactCommon.BaseMutationOptions<DropEventMutation, DropEventMutationVariables>;
export const RestoreDroppedEventDocument = gql`
    mutation RestoreDroppedEvent($input: RestoreDroppedEventInput!) {
  restoreDroppedEvent(input: $input) {
    event {
      id
      status
    }
  }
}
    `;
export type RestoreDroppedEventMutationFn = ApolloReactCommon.MutationFunction<RestoreDroppedEventMutation, RestoreDroppedEventMutationVariables>;

/**
 * __useRestoreDroppedEventMutation__
 *
 * To run a mutation, you first call `useRestoreDroppedEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRestoreDroppedEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [restoreDroppedEventMutation, { data, loading, error }] = useRestoreDroppedEventMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRestoreDroppedEventMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RestoreDroppedEventMutation, RestoreDroppedEventMutationVariables>) {
        return ApolloReactHooks.useMutation<RestoreDroppedEventMutation, RestoreDroppedEventMutationVariables>(RestoreDroppedEventDocument, baseOptions);
      }
export type RestoreDroppedEventMutationHookResult = ReturnType<typeof useRestoreDroppedEventMutation>;
export type RestoreDroppedEventMutationResult = ApolloReactCommon.MutationResult<RestoreDroppedEventMutation>;
export type RestoreDroppedEventMutationOptions = ApolloReactCommon.BaseMutationOptions<RestoreDroppedEventMutation, RestoreDroppedEventMutationVariables>;
export const UpdateEventDocument = gql`
    mutation UpdateEvent($input: UpdateEventInput!) {
  updateEvent(input: $input) {
    event {
      id
      ...EventFields
    }
  }
}
    ${EventFieldsFragmentDoc}`;
export type UpdateEventMutationFn = ApolloReactCommon.MutationFunction<UpdateEventMutation, UpdateEventMutationVariables>;

/**
 * __useUpdateEventMutation__
 *
 * To run a mutation, you first call `useUpdateEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateEventMutation, { data, loading, error }] = useUpdateEventMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateEventMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateEventMutation, UpdateEventMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateEventMutation, UpdateEventMutationVariables>(UpdateEventDocument, baseOptions);
      }
export type UpdateEventMutationHookResult = ReturnType<typeof useUpdateEventMutation>;
export type UpdateEventMutationResult = ApolloReactCommon.MutationResult<UpdateEventMutation>;
export type UpdateEventMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateEventMutation, UpdateEventMutationVariables>;
export const CreateRunDocument = gql`
    mutation CreateRun($input: CreateRunInput!) {
  createRun(input: $input) {
    run {
      id
      ...RunFields
    }
  }
}
    ${RunFieldsFragmentDoc}`;
export type CreateRunMutationFn = ApolloReactCommon.MutationFunction<CreateRunMutation, CreateRunMutationVariables>;

/**
 * __useCreateRunMutation__
 *
 * To run a mutation, you first call `useCreateRunMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRunMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRunMutation, { data, loading, error }] = useCreateRunMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateRunMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateRunMutation, CreateRunMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateRunMutation, CreateRunMutationVariables>(CreateRunDocument, baseOptions);
      }
export type CreateRunMutationHookResult = ReturnType<typeof useCreateRunMutation>;
export type CreateRunMutationResult = ApolloReactCommon.MutationResult<CreateRunMutation>;
export type CreateRunMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateRunMutation, CreateRunMutationVariables>;
export const CreateMultipleRunsDocument = gql`
    mutation CreateMultipleRuns($input: CreateMultipleRunsInput!) {
  createMultipleRuns(input: $input) {
    runs {
      id
      ...RunFields
    }
  }
}
    ${RunFieldsFragmentDoc}`;
export type CreateMultipleRunsMutationFn = ApolloReactCommon.MutationFunction<CreateMultipleRunsMutation, CreateMultipleRunsMutationVariables>;

/**
 * __useCreateMultipleRunsMutation__
 *
 * To run a mutation, you first call `useCreateMultipleRunsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMultipleRunsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMultipleRunsMutation, { data, loading, error }] = useCreateMultipleRunsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateMultipleRunsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateMultipleRunsMutation, CreateMultipleRunsMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateMultipleRunsMutation, CreateMultipleRunsMutationVariables>(CreateMultipleRunsDocument, baseOptions);
      }
export type CreateMultipleRunsMutationHookResult = ReturnType<typeof useCreateMultipleRunsMutation>;
export type CreateMultipleRunsMutationResult = ApolloReactCommon.MutationResult<CreateMultipleRunsMutation>;
export type CreateMultipleRunsMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateMultipleRunsMutation, CreateMultipleRunsMutationVariables>;
export const UpdateRunDocument = gql`
    mutation UpdateRun($input: UpdateRunInput!) {
  updateRun(input: $input) {
    run {
      id
      ...RunFields
    }
  }
}
    ${RunFieldsFragmentDoc}`;
export type UpdateRunMutationFn = ApolloReactCommon.MutationFunction<UpdateRunMutation, UpdateRunMutationVariables>;

/**
 * __useUpdateRunMutation__
 *
 * To run a mutation, you first call `useUpdateRunMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRunMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRunMutation, { data, loading, error }] = useUpdateRunMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateRunMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateRunMutation, UpdateRunMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateRunMutation, UpdateRunMutationVariables>(UpdateRunDocument, baseOptions);
      }
export type UpdateRunMutationHookResult = ReturnType<typeof useUpdateRunMutation>;
export type UpdateRunMutationResult = ApolloReactCommon.MutationResult<UpdateRunMutation>;
export type UpdateRunMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateRunMutation, UpdateRunMutationVariables>;
export const DeleteRunDocument = gql`
    mutation DeleteRun($input: DeleteRunInput!) {
  deleteRun(input: $input) {
    run {
      id
      ...RunFields
    }
  }
}
    ${RunFieldsFragmentDoc}`;
export type DeleteRunMutationFn = ApolloReactCommon.MutationFunction<DeleteRunMutation, DeleteRunMutationVariables>;

/**
 * __useDeleteRunMutation__
 *
 * To run a mutation, you first call `useDeleteRunMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRunMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteRunMutation, { data, loading, error }] = useDeleteRunMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteRunMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteRunMutation, DeleteRunMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteRunMutation, DeleteRunMutationVariables>(DeleteRunDocument, baseOptions);
      }
export type DeleteRunMutationHookResult = ReturnType<typeof useDeleteRunMutation>;
export type DeleteRunMutationResult = ApolloReactCommon.MutationResult<DeleteRunMutation>;
export type DeleteRunMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteRunMutation, DeleteRunMutationVariables>;
export const CreateMaximumEventProvidedTicketsOverrideDocument = gql`
    mutation CreateMaximumEventProvidedTicketsOverride($input: CreateMaximumEventProvidedTicketsOverrideInput!) {
  createMaximumEventProvidedTicketsOverride(input: $input) {
    maximum_event_provided_tickets_override {
      id
      ...MaximumEventProvidedTicketsOverrideFields
    }
  }
}
    ${MaximumEventProvidedTicketsOverrideFieldsFragmentDoc}`;
export type CreateMaximumEventProvidedTicketsOverrideMutationFn = ApolloReactCommon.MutationFunction<CreateMaximumEventProvidedTicketsOverrideMutation, CreateMaximumEventProvidedTicketsOverrideMutationVariables>;

/**
 * __useCreateMaximumEventProvidedTicketsOverrideMutation__
 *
 * To run a mutation, you first call `useCreateMaximumEventProvidedTicketsOverrideMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMaximumEventProvidedTicketsOverrideMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMaximumEventProvidedTicketsOverrideMutation, { data, loading, error }] = useCreateMaximumEventProvidedTicketsOverrideMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateMaximumEventProvidedTicketsOverrideMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateMaximumEventProvidedTicketsOverrideMutation, CreateMaximumEventProvidedTicketsOverrideMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateMaximumEventProvidedTicketsOverrideMutation, CreateMaximumEventProvidedTicketsOverrideMutationVariables>(CreateMaximumEventProvidedTicketsOverrideDocument, baseOptions);
      }
export type CreateMaximumEventProvidedTicketsOverrideMutationHookResult = ReturnType<typeof useCreateMaximumEventProvidedTicketsOverrideMutation>;
export type CreateMaximumEventProvidedTicketsOverrideMutationResult = ApolloReactCommon.MutationResult<CreateMaximumEventProvidedTicketsOverrideMutation>;
export type CreateMaximumEventProvidedTicketsOverrideMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateMaximumEventProvidedTicketsOverrideMutation, CreateMaximumEventProvidedTicketsOverrideMutationVariables>;
export const DeleteMaximumEventProvidedTicketsOverrideDocument = gql`
    mutation DeleteMaximumEventProvidedTicketsOverride($input: DeleteMaximumEventProvidedTicketsOverrideInput!) {
  deleteMaximumEventProvidedTicketsOverride(input: $input) {
    maximum_event_provided_tickets_override {
      id
      ...MaximumEventProvidedTicketsOverrideFields
    }
  }
}
    ${MaximumEventProvidedTicketsOverrideFieldsFragmentDoc}`;
export type DeleteMaximumEventProvidedTicketsOverrideMutationFn = ApolloReactCommon.MutationFunction<DeleteMaximumEventProvidedTicketsOverrideMutation, DeleteMaximumEventProvidedTicketsOverrideMutationVariables>;

/**
 * __useDeleteMaximumEventProvidedTicketsOverrideMutation__
 *
 * To run a mutation, you first call `useDeleteMaximumEventProvidedTicketsOverrideMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMaximumEventProvidedTicketsOverrideMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMaximumEventProvidedTicketsOverrideMutation, { data, loading, error }] = useDeleteMaximumEventProvidedTicketsOverrideMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteMaximumEventProvidedTicketsOverrideMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteMaximumEventProvidedTicketsOverrideMutation, DeleteMaximumEventProvidedTicketsOverrideMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteMaximumEventProvidedTicketsOverrideMutation, DeleteMaximumEventProvidedTicketsOverrideMutationVariables>(DeleteMaximumEventProvidedTicketsOverrideDocument, baseOptions);
      }
export type DeleteMaximumEventProvidedTicketsOverrideMutationHookResult = ReturnType<typeof useDeleteMaximumEventProvidedTicketsOverrideMutation>;
export type DeleteMaximumEventProvidedTicketsOverrideMutationResult = ApolloReactCommon.MutationResult<DeleteMaximumEventProvidedTicketsOverrideMutation>;
export type DeleteMaximumEventProvidedTicketsOverrideMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteMaximumEventProvidedTicketsOverrideMutation, DeleteMaximumEventProvidedTicketsOverrideMutationVariables>;
export const UpdateMaximumEventProvidedTicketsOverrideDocument = gql`
    mutation UpdateMaximumEventProvidedTicketsOverride($input: UpdateMaximumEventProvidedTicketsOverrideInput!) {
  updateMaximumEventProvidedTicketsOverride(input: $input) {
    maximum_event_provided_tickets_override {
      id
      ...MaximumEventProvidedTicketsOverrideFields
    }
  }
}
    ${MaximumEventProvidedTicketsOverrideFieldsFragmentDoc}`;
export type UpdateMaximumEventProvidedTicketsOverrideMutationFn = ApolloReactCommon.MutationFunction<UpdateMaximumEventProvidedTicketsOverrideMutation, UpdateMaximumEventProvidedTicketsOverrideMutationVariables>;

/**
 * __useUpdateMaximumEventProvidedTicketsOverrideMutation__
 *
 * To run a mutation, you first call `useUpdateMaximumEventProvidedTicketsOverrideMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMaximumEventProvidedTicketsOverrideMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMaximumEventProvidedTicketsOverrideMutation, { data, loading, error }] = useUpdateMaximumEventProvidedTicketsOverrideMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateMaximumEventProvidedTicketsOverrideMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateMaximumEventProvidedTicketsOverrideMutation, UpdateMaximumEventProvidedTicketsOverrideMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateMaximumEventProvidedTicketsOverrideMutation, UpdateMaximumEventProvidedTicketsOverrideMutationVariables>(UpdateMaximumEventProvidedTicketsOverrideDocument, baseOptions);
      }
export type UpdateMaximumEventProvidedTicketsOverrideMutationHookResult = ReturnType<typeof useUpdateMaximumEventProvidedTicketsOverrideMutation>;
export type UpdateMaximumEventProvidedTicketsOverrideMutationResult = ApolloReactCommon.MutationResult<UpdateMaximumEventProvidedTicketsOverrideMutation>;
export type UpdateMaximumEventProvidedTicketsOverrideMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateMaximumEventProvidedTicketsOverrideMutation, UpdateMaximumEventProvidedTicketsOverrideMutationVariables>;
export const UpdateEventAdminNotesDocument = gql`
    mutation UpdateEventAdminNotes($eventId: Int!, $adminNotes: String!) {
  updateEventAdminNotes(input: {id: $eventId, admin_notes: $adminNotes}) {
    event {
      id
      ...EventFields
    }
  }
}
    ${EventFieldsFragmentDoc}`;
export type UpdateEventAdminNotesMutationFn = ApolloReactCommon.MutationFunction<UpdateEventAdminNotesMutation, UpdateEventAdminNotesMutationVariables>;

/**
 * __useUpdateEventAdminNotesMutation__
 *
 * To run a mutation, you first call `useUpdateEventAdminNotesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateEventAdminNotesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateEventAdminNotesMutation, { data, loading, error }] = useUpdateEventAdminNotesMutation({
 *   variables: {
 *      eventId: // value for 'eventId'
 *      adminNotes: // value for 'adminNotes'
 *   },
 * });
 */
export function useUpdateEventAdminNotesMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateEventAdminNotesMutation, UpdateEventAdminNotesMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateEventAdminNotesMutation, UpdateEventAdminNotesMutationVariables>(UpdateEventAdminNotesDocument, baseOptions);
      }
export type UpdateEventAdminNotesMutationHookResult = ReturnType<typeof useUpdateEventAdminNotesMutation>;
export type UpdateEventAdminNotesMutationResult = ApolloReactCommon.MutationResult<UpdateEventAdminNotesMutation>;
export type UpdateEventAdminNotesMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateEventAdminNotesMutation, UpdateEventAdminNotesMutationVariables>;
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
export const CommonConventionDataQueryDocument = gql`
    query CommonConventionDataQuery {
  convention {
    id
    ...CommonConventionData
  }
}
    ${CommonConventionDataFragmentDoc}`;

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
        return ApolloReactHooks.useQuery<CommonConventionDataQueryQuery, CommonConventionDataQueryQueryVariables>(CommonConventionDataQueryDocument, baseOptions);
      }
export function useCommonConventionDataQueryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<CommonConventionDataQueryQuery, CommonConventionDataQueryQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<CommonConventionDataQueryQuery, CommonConventionDataQueryQueryVariables>(CommonConventionDataQueryDocument, baseOptions);
        }
export type CommonConventionDataQueryQueryHookResult = ReturnType<typeof useCommonConventionDataQueryQuery>;
export type CommonConventionDataQueryLazyQueryHookResult = ReturnType<typeof useCommonConventionDataQueryLazyQuery>;
export type CommonConventionDataQueryQueryResult = ApolloReactCommon.QueryResult<CommonConventionDataQueryQuery, CommonConventionDataQueryQueryVariables>;