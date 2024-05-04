/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { EventFieldsFragmentDoc, RunFieldsFragmentDoc, MaximumEventProvidedTicketsOverrideFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateEventMutationVariables = Types.Exact<{
  input: Types.CreateEventInput;
}>;


export type CreateEventMutationData = { __typename: 'Mutation', createEvent: { __typename: 'CreateEventPayload', event: { __typename: 'Event', id: string, title?: string | null, author?: string | null, description?: string | null, organization?: string | null, url?: string | null, con_mail_destination?: string | null, can_play_concurrently: boolean, short_blurb?: string | null, participant_communications?: string | null, content_warnings?: string | null, email?: string | null, length_seconds: number, status?: string | null, description_html?: string | null, current_user_form_item_viewer_role: Types.FormItemRole, current_user_form_item_writer_role: Types.FormItemRole, admin_notes?: string | null, event_category: { __typename: 'EventCategory', id: string }, registration_policy?: { __typename: 'RegistrationPolicy', slots_limited?: boolean | null, prevent_no_preference_signups: boolean, buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, name?: string | null, description?: string | null, minimum_slots?: number | null, preferred_slots?: number | null, total_slots?: number | null, slots_limited: boolean, anything: boolean, not_counted: boolean }> } | null, runs: Array<{ __typename: 'Run', id: string, starts_at: string, schedule_note?: string | null, title_suffix?: string | null, room_names: Array<string>, confirmed_signup_count: number, not_counted_signup_count: number, grouped_signup_counts: Array<{ __typename: 'GroupedSignupCount', bucket_key?: string | null, count: number, counted: boolean, state: Types.SignupState, team_member: boolean }>, rooms: Array<{ __typename: 'Room', id: string, name?: string | null }>, my_signups: Array<{ __typename: 'Signup', id: string, state: Types.SignupState }>, my_signup_requests: Array<{ __typename: 'SignupRequest', id: string, state: Types.SignupRequestState }>, my_signup_ranked_choices: Array<{ __typename: 'SignupRankedChoice', id: string, priority: number, state: Types.SignupRankedChoiceState }> }>, maximum_event_provided_tickets_overrides: Array<{ __typename: 'MaximumEventProvidedTicketsOverride', id: string, override_value: number, ticket_type: { __typename: 'TicketType', id: string, description?: string | null, maximum_event_provided_tickets: number } }>, images: Array<{ __typename: 'ActiveStorageAttachment', id: string, byte_size: number, content_type: string, filename: string, url: string }> } } };

export type CreateFillerEventMutationVariables = Types.Exact<{
  input: Types.CreateFillerEventInput;
}>;


export type CreateFillerEventMutationData = { __typename: 'Mutation', createFillerEvent: { __typename: 'CreateFillerEventPayload', event: { __typename: 'Event', id: string, title?: string | null, author?: string | null, description?: string | null, organization?: string | null, url?: string | null, con_mail_destination?: string | null, can_play_concurrently: boolean, short_blurb?: string | null, participant_communications?: string | null, content_warnings?: string | null, email?: string | null, length_seconds: number, status?: string | null, description_html?: string | null, current_user_form_item_viewer_role: Types.FormItemRole, current_user_form_item_writer_role: Types.FormItemRole, admin_notes?: string | null, event_category: { __typename: 'EventCategory', id: string }, registration_policy?: { __typename: 'RegistrationPolicy', slots_limited?: boolean | null, prevent_no_preference_signups: boolean, buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, name?: string | null, description?: string | null, minimum_slots?: number | null, preferred_slots?: number | null, total_slots?: number | null, slots_limited: boolean, anything: boolean, not_counted: boolean }> } | null, runs: Array<{ __typename: 'Run', id: string, starts_at: string, schedule_note?: string | null, title_suffix?: string | null, room_names: Array<string>, confirmed_signup_count: number, not_counted_signup_count: number, grouped_signup_counts: Array<{ __typename: 'GroupedSignupCount', bucket_key?: string | null, count: number, counted: boolean, state: Types.SignupState, team_member: boolean }>, rooms: Array<{ __typename: 'Room', id: string, name?: string | null }>, my_signups: Array<{ __typename: 'Signup', id: string, state: Types.SignupState }>, my_signup_requests: Array<{ __typename: 'SignupRequest', id: string, state: Types.SignupRequestState }>, my_signup_ranked_choices: Array<{ __typename: 'SignupRankedChoice', id: string, priority: number, state: Types.SignupRankedChoiceState }> }>, maximum_event_provided_tickets_overrides: Array<{ __typename: 'MaximumEventProvidedTicketsOverride', id: string, override_value: number, ticket_type: { __typename: 'TicketType', id: string, description?: string | null, maximum_event_provided_tickets: number } }>, images: Array<{ __typename: 'ActiveStorageAttachment', id: string, byte_size: number, content_type: string, filename: string, url: string }> } } };

export type DropEventMutationVariables = Types.Exact<{
  input: Types.DropEventInput;
}>;


export type DropEventMutationData = { __typename: 'Mutation', dropEvent: { __typename: 'DropEventPayload', event: { __typename: 'Event', id: string, status?: string | null } } };

export type RestoreDroppedEventMutationVariables = Types.Exact<{
  input: Types.RestoreDroppedEventInput;
}>;


export type RestoreDroppedEventMutationData = { __typename: 'Mutation', restoreDroppedEvent: { __typename: 'RestoreDroppedEventPayload', event: { __typename: 'Event', id: string, status?: string | null } } };

export type AttachImageToEventMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  signedBlobId: Types.Scalars['ID']['input'];
}>;


export type AttachImageToEventMutationData = { __typename: 'Mutation', attachImageToEvent: { __typename: 'AttachImageToEventPayload', event: { __typename: 'Event', id: string, title?: string | null, author?: string | null, description?: string | null, organization?: string | null, url?: string | null, con_mail_destination?: string | null, can_play_concurrently: boolean, short_blurb?: string | null, participant_communications?: string | null, content_warnings?: string | null, email?: string | null, length_seconds: number, status?: string | null, description_html?: string | null, current_user_form_item_viewer_role: Types.FormItemRole, current_user_form_item_writer_role: Types.FormItemRole, admin_notes?: string | null, event_category: { __typename: 'EventCategory', id: string }, registration_policy?: { __typename: 'RegistrationPolicy', slots_limited?: boolean | null, prevent_no_preference_signups: boolean, buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, name?: string | null, description?: string | null, minimum_slots?: number | null, preferred_slots?: number | null, total_slots?: number | null, slots_limited: boolean, anything: boolean, not_counted: boolean }> } | null, runs: Array<{ __typename: 'Run', id: string, starts_at: string, schedule_note?: string | null, title_suffix?: string | null, room_names: Array<string>, confirmed_signup_count: number, not_counted_signup_count: number, grouped_signup_counts: Array<{ __typename: 'GroupedSignupCount', bucket_key?: string | null, count: number, counted: boolean, state: Types.SignupState, team_member: boolean }>, rooms: Array<{ __typename: 'Room', id: string, name?: string | null }>, my_signups: Array<{ __typename: 'Signup', id: string, state: Types.SignupState }>, my_signup_requests: Array<{ __typename: 'SignupRequest', id: string, state: Types.SignupRequestState }>, my_signup_ranked_choices: Array<{ __typename: 'SignupRankedChoice', id: string, priority: number, state: Types.SignupRankedChoiceState }> }>, maximum_event_provided_tickets_overrides: Array<{ __typename: 'MaximumEventProvidedTicketsOverride', id: string, override_value: number, ticket_type: { __typename: 'TicketType', id: string, description?: string | null, maximum_event_provided_tickets: number } }>, images: Array<{ __typename: 'ActiveStorageAttachment', id: string, byte_size: number, content_type: string, filename: string, url: string }> } } };

export type UpdateEventMutationVariables = Types.Exact<{
  input: Types.UpdateEventInput;
}>;


export type UpdateEventMutationData = { __typename: 'Mutation', updateEvent: { __typename: 'UpdateEventPayload', event: { __typename: 'Event', id: string, title?: string | null, author?: string | null, description?: string | null, organization?: string | null, url?: string | null, con_mail_destination?: string | null, can_play_concurrently: boolean, short_blurb?: string | null, participant_communications?: string | null, content_warnings?: string | null, email?: string | null, length_seconds: number, status?: string | null, description_html?: string | null, current_user_form_item_viewer_role: Types.FormItemRole, current_user_form_item_writer_role: Types.FormItemRole, admin_notes?: string | null, event_category: { __typename: 'EventCategory', id: string }, registration_policy?: { __typename: 'RegistrationPolicy', slots_limited?: boolean | null, prevent_no_preference_signups: boolean, buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, name?: string | null, description?: string | null, minimum_slots?: number | null, preferred_slots?: number | null, total_slots?: number | null, slots_limited: boolean, anything: boolean, not_counted: boolean }> } | null, runs: Array<{ __typename: 'Run', id: string, starts_at: string, schedule_note?: string | null, title_suffix?: string | null, room_names: Array<string>, confirmed_signup_count: number, not_counted_signup_count: number, grouped_signup_counts: Array<{ __typename: 'GroupedSignupCount', bucket_key?: string | null, count: number, counted: boolean, state: Types.SignupState, team_member: boolean }>, rooms: Array<{ __typename: 'Room', id: string, name?: string | null }>, my_signups: Array<{ __typename: 'Signup', id: string, state: Types.SignupState }>, my_signup_requests: Array<{ __typename: 'SignupRequest', id: string, state: Types.SignupRequestState }>, my_signup_ranked_choices: Array<{ __typename: 'SignupRankedChoice', id: string, priority: number, state: Types.SignupRankedChoiceState }> }>, maximum_event_provided_tickets_overrides: Array<{ __typename: 'MaximumEventProvidedTicketsOverride', id: string, override_value: number, ticket_type: { __typename: 'TicketType', id: string, description?: string | null, maximum_event_provided_tickets: number } }>, images: Array<{ __typename: 'ActiveStorageAttachment', id: string, byte_size: number, content_type: string, filename: string, url: string }> } } };

export type CreateRunMutationVariables = Types.Exact<{
  input: Types.CreateRunInput;
}>;


export type CreateRunMutationData = { __typename: 'Mutation', createRun: { __typename: 'CreateRunPayload', run: { __typename: 'Run', id: string, starts_at: string, schedule_note?: string | null, title_suffix?: string | null, room_names: Array<string>, confirmed_signup_count: number, not_counted_signup_count: number, grouped_signup_counts: Array<{ __typename: 'GroupedSignupCount', bucket_key?: string | null, count: number, counted: boolean, state: Types.SignupState, team_member: boolean }>, rooms: Array<{ __typename: 'Room', id: string, name?: string | null }>, my_signups: Array<{ __typename: 'Signup', id: string, state: Types.SignupState }>, my_signup_requests: Array<{ __typename: 'SignupRequest', id: string, state: Types.SignupRequestState }>, my_signup_ranked_choices: Array<{ __typename: 'SignupRankedChoice', id: string, priority: number, state: Types.SignupRankedChoiceState }> } } };

export type CreateMultipleRunsMutationVariables = Types.Exact<{
  input: Types.CreateMultipleRunsInput;
}>;


export type CreateMultipleRunsMutationData = { __typename: 'Mutation', createMultipleRuns: { __typename: 'CreateMultipleRunsPayload', runs: Array<{ __typename: 'Run', id: string, starts_at: string, schedule_note?: string | null, title_suffix?: string | null, room_names: Array<string>, confirmed_signup_count: number, not_counted_signup_count: number, grouped_signup_counts: Array<{ __typename: 'GroupedSignupCount', bucket_key?: string | null, count: number, counted: boolean, state: Types.SignupState, team_member: boolean }>, rooms: Array<{ __typename: 'Room', id: string, name?: string | null }>, my_signups: Array<{ __typename: 'Signup', id: string, state: Types.SignupState }>, my_signup_requests: Array<{ __typename: 'SignupRequest', id: string, state: Types.SignupRequestState }>, my_signup_ranked_choices: Array<{ __typename: 'SignupRankedChoice', id: string, priority: number, state: Types.SignupRankedChoiceState }> }> } };

export type UpdateRunMutationVariables = Types.Exact<{
  input: Types.UpdateRunInput;
}>;


export type UpdateRunMutationData = { __typename: 'Mutation', updateRun: { __typename: 'UpdateRunPayload', run: { __typename: 'Run', id: string, starts_at: string, schedule_note?: string | null, title_suffix?: string | null, room_names: Array<string>, confirmed_signup_count: number, not_counted_signup_count: number, grouped_signup_counts: Array<{ __typename: 'GroupedSignupCount', bucket_key?: string | null, count: number, counted: boolean, state: Types.SignupState, team_member: boolean }>, rooms: Array<{ __typename: 'Room', id: string, name?: string | null }>, my_signups: Array<{ __typename: 'Signup', id: string, state: Types.SignupState }>, my_signup_requests: Array<{ __typename: 'SignupRequest', id: string, state: Types.SignupRequestState }>, my_signup_ranked_choices: Array<{ __typename: 'SignupRankedChoice', id: string, priority: number, state: Types.SignupRankedChoiceState }> } } };

export type DeleteRunMutationVariables = Types.Exact<{
  input: Types.DeleteRunInput;
}>;


export type DeleteRunMutationData = { __typename: 'Mutation', deleteRun: { __typename: 'DeleteRunPayload', run: { __typename: 'Run', id: string, starts_at: string, schedule_note?: string | null, title_suffix?: string | null, room_names: Array<string>, confirmed_signup_count: number, not_counted_signup_count: number, grouped_signup_counts: Array<{ __typename: 'GroupedSignupCount', bucket_key?: string | null, count: number, counted: boolean, state: Types.SignupState, team_member: boolean }>, rooms: Array<{ __typename: 'Room', id: string, name?: string | null }>, my_signups: Array<{ __typename: 'Signup', id: string, state: Types.SignupState }>, my_signup_requests: Array<{ __typename: 'SignupRequest', id: string, state: Types.SignupRequestState }>, my_signup_ranked_choices: Array<{ __typename: 'SignupRankedChoice', id: string, priority: number, state: Types.SignupRankedChoiceState }> } } };

export type CreateMaximumEventProvidedTicketsOverrideMutationVariables = Types.Exact<{
  input: Types.CreateMaximumEventProvidedTicketsOverrideInput;
}>;


export type CreateMaximumEventProvidedTicketsOverrideMutationData = { __typename: 'Mutation', createMaximumEventProvidedTicketsOverride: { __typename: 'CreateMaximumEventProvidedTicketsOverridePayload', maximum_event_provided_tickets_override: { __typename: 'MaximumEventProvidedTicketsOverride', id: string, override_value: number, ticket_type: { __typename: 'TicketType', id: string, description?: string | null, maximum_event_provided_tickets: number } } } };

export type DeleteMaximumEventProvidedTicketsOverrideMutationVariables = Types.Exact<{
  input: Types.DeleteMaximumEventProvidedTicketsOverrideInput;
}>;


export type DeleteMaximumEventProvidedTicketsOverrideMutationData = { __typename: 'Mutation', deleteMaximumEventProvidedTicketsOverride: { __typename: 'DeleteMaximumEventProvidedTicketsOverridePayload', maximum_event_provided_tickets_override: { __typename: 'MaximumEventProvidedTicketsOverride', id: string, override_value: number, ticket_type: { __typename: 'TicketType', id: string, description?: string | null, maximum_event_provided_tickets: number } } } };

export type UpdateMaximumEventProvidedTicketsOverrideMutationVariables = Types.Exact<{
  input: Types.UpdateMaximumEventProvidedTicketsOverrideInput;
}>;


export type UpdateMaximumEventProvidedTicketsOverrideMutationData = { __typename: 'Mutation', updateMaximumEventProvidedTicketsOverride: { __typename: 'UpdateMaximumEventProvidedTicketsOverridePayload', maximum_event_provided_tickets_override: { __typename: 'MaximumEventProvidedTicketsOverride', id: string, override_value: number, ticket_type: { __typename: 'TicketType', id: string, description?: string | null, maximum_event_provided_tickets: number } } } };

export type UpdateEventAdminNotesMutationVariables = Types.Exact<{
  eventId: Types.Scalars['ID']['input'];
  adminNotes: Types.Scalars['String']['input'];
}>;


export type UpdateEventAdminNotesMutationData = { __typename: 'Mutation', updateEventAdminNotes: { __typename: 'UpdateEventAdminNotesPayload', event: { __typename: 'Event', id: string, title?: string | null, author?: string | null, description?: string | null, organization?: string | null, url?: string | null, con_mail_destination?: string | null, can_play_concurrently: boolean, short_blurb?: string | null, participant_communications?: string | null, content_warnings?: string | null, email?: string | null, length_seconds: number, status?: string | null, description_html?: string | null, current_user_form_item_viewer_role: Types.FormItemRole, current_user_form_item_writer_role: Types.FormItemRole, admin_notes?: string | null, event_category: { __typename: 'EventCategory', id: string }, registration_policy?: { __typename: 'RegistrationPolicy', slots_limited?: boolean | null, prevent_no_preference_signups: boolean, buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, name?: string | null, description?: string | null, minimum_slots?: number | null, preferred_slots?: number | null, total_slots?: number | null, slots_limited: boolean, anything: boolean, not_counted: boolean }> } | null, runs: Array<{ __typename: 'Run', id: string, starts_at: string, schedule_note?: string | null, title_suffix?: string | null, room_names: Array<string>, confirmed_signup_count: number, not_counted_signup_count: number, grouped_signup_counts: Array<{ __typename: 'GroupedSignupCount', bucket_key?: string | null, count: number, counted: boolean, state: Types.SignupState, team_member: boolean }>, rooms: Array<{ __typename: 'Room', id: string, name?: string | null }>, my_signups: Array<{ __typename: 'Signup', id: string, state: Types.SignupState }>, my_signup_requests: Array<{ __typename: 'SignupRequest', id: string, state: Types.SignupRequestState }>, my_signup_ranked_choices: Array<{ __typename: 'SignupRankedChoice', id: string, priority: number, state: Types.SignupRankedChoiceState }> }>, maximum_event_provided_tickets_overrides: Array<{ __typename: 'MaximumEventProvidedTicketsOverride', id: string, override_value: number, ticket_type: { __typename: 'TicketType', id: string, description?: string | null, maximum_event_provided_tickets: number } }>, images: Array<{ __typename: 'ActiveStorageAttachment', id: string, byte_size: number, content_type: string, filename: string, url: string }> } } };


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
export type CreateEventMutationFn = Apollo.MutationFunction<CreateEventMutationData, CreateEventMutationVariables>;

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
export function useCreateEventMutation(baseOptions?: Apollo.MutationHookOptions<CreateEventMutationData, CreateEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateEventMutationData, CreateEventMutationVariables>(CreateEventDocument, options);
      }
export type CreateEventMutationHookResult = ReturnType<typeof useCreateEventMutation>;
export type CreateEventMutationResult = Apollo.MutationResult<CreateEventMutationData>;
export type CreateEventMutationOptions = Apollo.BaseMutationOptions<CreateEventMutationData, CreateEventMutationVariables>;
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
export type CreateFillerEventMutationFn = Apollo.MutationFunction<CreateFillerEventMutationData, CreateFillerEventMutationVariables>;

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
export function useCreateFillerEventMutation(baseOptions?: Apollo.MutationHookOptions<CreateFillerEventMutationData, CreateFillerEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateFillerEventMutationData, CreateFillerEventMutationVariables>(CreateFillerEventDocument, options);
      }
export type CreateFillerEventMutationHookResult = ReturnType<typeof useCreateFillerEventMutation>;
export type CreateFillerEventMutationResult = Apollo.MutationResult<CreateFillerEventMutationData>;
export type CreateFillerEventMutationOptions = Apollo.BaseMutationOptions<CreateFillerEventMutationData, CreateFillerEventMutationVariables>;
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
export type DropEventMutationFn = Apollo.MutationFunction<DropEventMutationData, DropEventMutationVariables>;

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
export function useDropEventMutation(baseOptions?: Apollo.MutationHookOptions<DropEventMutationData, DropEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DropEventMutationData, DropEventMutationVariables>(DropEventDocument, options);
      }
export type DropEventMutationHookResult = ReturnType<typeof useDropEventMutation>;
export type DropEventMutationResult = Apollo.MutationResult<DropEventMutationData>;
export type DropEventMutationOptions = Apollo.BaseMutationOptions<DropEventMutationData, DropEventMutationVariables>;
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
export type RestoreDroppedEventMutationFn = Apollo.MutationFunction<RestoreDroppedEventMutationData, RestoreDroppedEventMutationVariables>;

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
export function useRestoreDroppedEventMutation(baseOptions?: Apollo.MutationHookOptions<RestoreDroppedEventMutationData, RestoreDroppedEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RestoreDroppedEventMutationData, RestoreDroppedEventMutationVariables>(RestoreDroppedEventDocument, options);
      }
export type RestoreDroppedEventMutationHookResult = ReturnType<typeof useRestoreDroppedEventMutation>;
export type RestoreDroppedEventMutationResult = Apollo.MutationResult<RestoreDroppedEventMutationData>;
export type RestoreDroppedEventMutationOptions = Apollo.BaseMutationOptions<RestoreDroppedEventMutationData, RestoreDroppedEventMutationVariables>;
export const AttachImageToEventDocument = gql`
    mutation AttachImageToEvent($id: ID!, $signedBlobId: ID!) {
  attachImageToEvent(input: {id: $id, signedBlobId: $signedBlobId}) {
    event {
      id
      ...EventFields
    }
  }
}
    ${EventFieldsFragmentDoc}`;
export type AttachImageToEventMutationFn = Apollo.MutationFunction<AttachImageToEventMutationData, AttachImageToEventMutationVariables>;

/**
 * __useAttachImageToEventMutation__
 *
 * To run a mutation, you first call `useAttachImageToEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAttachImageToEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [attachImageToEventMutation, { data, loading, error }] = useAttachImageToEventMutation({
 *   variables: {
 *      id: // value for 'id'
 *      signedBlobId: // value for 'signedBlobId'
 *   },
 * });
 */
export function useAttachImageToEventMutation(baseOptions?: Apollo.MutationHookOptions<AttachImageToEventMutationData, AttachImageToEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AttachImageToEventMutationData, AttachImageToEventMutationVariables>(AttachImageToEventDocument, options);
      }
export type AttachImageToEventMutationHookResult = ReturnType<typeof useAttachImageToEventMutation>;
export type AttachImageToEventMutationResult = Apollo.MutationResult<AttachImageToEventMutationData>;
export type AttachImageToEventMutationOptions = Apollo.BaseMutationOptions<AttachImageToEventMutationData, AttachImageToEventMutationVariables>;
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
export type UpdateEventMutationFn = Apollo.MutationFunction<UpdateEventMutationData, UpdateEventMutationVariables>;

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
export function useUpdateEventMutation(baseOptions?: Apollo.MutationHookOptions<UpdateEventMutationData, UpdateEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateEventMutationData, UpdateEventMutationVariables>(UpdateEventDocument, options);
      }
export type UpdateEventMutationHookResult = ReturnType<typeof useUpdateEventMutation>;
export type UpdateEventMutationResult = Apollo.MutationResult<UpdateEventMutationData>;
export type UpdateEventMutationOptions = Apollo.BaseMutationOptions<UpdateEventMutationData, UpdateEventMutationVariables>;
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
export type CreateRunMutationFn = Apollo.MutationFunction<CreateRunMutationData, CreateRunMutationVariables>;

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
export function useCreateRunMutation(baseOptions?: Apollo.MutationHookOptions<CreateRunMutationData, CreateRunMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateRunMutationData, CreateRunMutationVariables>(CreateRunDocument, options);
      }
export type CreateRunMutationHookResult = ReturnType<typeof useCreateRunMutation>;
export type CreateRunMutationResult = Apollo.MutationResult<CreateRunMutationData>;
export type CreateRunMutationOptions = Apollo.BaseMutationOptions<CreateRunMutationData, CreateRunMutationVariables>;
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
export type CreateMultipleRunsMutationFn = Apollo.MutationFunction<CreateMultipleRunsMutationData, CreateMultipleRunsMutationVariables>;

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
export function useCreateMultipleRunsMutation(baseOptions?: Apollo.MutationHookOptions<CreateMultipleRunsMutationData, CreateMultipleRunsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMultipleRunsMutationData, CreateMultipleRunsMutationVariables>(CreateMultipleRunsDocument, options);
      }
export type CreateMultipleRunsMutationHookResult = ReturnType<typeof useCreateMultipleRunsMutation>;
export type CreateMultipleRunsMutationResult = Apollo.MutationResult<CreateMultipleRunsMutationData>;
export type CreateMultipleRunsMutationOptions = Apollo.BaseMutationOptions<CreateMultipleRunsMutationData, CreateMultipleRunsMutationVariables>;
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
export type UpdateRunMutationFn = Apollo.MutationFunction<UpdateRunMutationData, UpdateRunMutationVariables>;

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
export function useUpdateRunMutation(baseOptions?: Apollo.MutationHookOptions<UpdateRunMutationData, UpdateRunMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateRunMutationData, UpdateRunMutationVariables>(UpdateRunDocument, options);
      }
export type UpdateRunMutationHookResult = ReturnType<typeof useUpdateRunMutation>;
export type UpdateRunMutationResult = Apollo.MutationResult<UpdateRunMutationData>;
export type UpdateRunMutationOptions = Apollo.BaseMutationOptions<UpdateRunMutationData, UpdateRunMutationVariables>;
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
export type DeleteRunMutationFn = Apollo.MutationFunction<DeleteRunMutationData, DeleteRunMutationVariables>;

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
export function useDeleteRunMutation(baseOptions?: Apollo.MutationHookOptions<DeleteRunMutationData, DeleteRunMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteRunMutationData, DeleteRunMutationVariables>(DeleteRunDocument, options);
      }
export type DeleteRunMutationHookResult = ReturnType<typeof useDeleteRunMutation>;
export type DeleteRunMutationResult = Apollo.MutationResult<DeleteRunMutationData>;
export type DeleteRunMutationOptions = Apollo.BaseMutationOptions<DeleteRunMutationData, DeleteRunMutationVariables>;
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
export type CreateMaximumEventProvidedTicketsOverrideMutationFn = Apollo.MutationFunction<CreateMaximumEventProvidedTicketsOverrideMutationData, CreateMaximumEventProvidedTicketsOverrideMutationVariables>;

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
export function useCreateMaximumEventProvidedTicketsOverrideMutation(baseOptions?: Apollo.MutationHookOptions<CreateMaximumEventProvidedTicketsOverrideMutationData, CreateMaximumEventProvidedTicketsOverrideMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMaximumEventProvidedTicketsOverrideMutationData, CreateMaximumEventProvidedTicketsOverrideMutationVariables>(CreateMaximumEventProvidedTicketsOverrideDocument, options);
      }
export type CreateMaximumEventProvidedTicketsOverrideMutationHookResult = ReturnType<typeof useCreateMaximumEventProvidedTicketsOverrideMutation>;
export type CreateMaximumEventProvidedTicketsOverrideMutationResult = Apollo.MutationResult<CreateMaximumEventProvidedTicketsOverrideMutationData>;
export type CreateMaximumEventProvidedTicketsOverrideMutationOptions = Apollo.BaseMutationOptions<CreateMaximumEventProvidedTicketsOverrideMutationData, CreateMaximumEventProvidedTicketsOverrideMutationVariables>;
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
export type DeleteMaximumEventProvidedTicketsOverrideMutationFn = Apollo.MutationFunction<DeleteMaximumEventProvidedTicketsOverrideMutationData, DeleteMaximumEventProvidedTicketsOverrideMutationVariables>;

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
export function useDeleteMaximumEventProvidedTicketsOverrideMutation(baseOptions?: Apollo.MutationHookOptions<DeleteMaximumEventProvidedTicketsOverrideMutationData, DeleteMaximumEventProvidedTicketsOverrideMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteMaximumEventProvidedTicketsOverrideMutationData, DeleteMaximumEventProvidedTicketsOverrideMutationVariables>(DeleteMaximumEventProvidedTicketsOverrideDocument, options);
      }
export type DeleteMaximumEventProvidedTicketsOverrideMutationHookResult = ReturnType<typeof useDeleteMaximumEventProvidedTicketsOverrideMutation>;
export type DeleteMaximumEventProvidedTicketsOverrideMutationResult = Apollo.MutationResult<DeleteMaximumEventProvidedTicketsOverrideMutationData>;
export type DeleteMaximumEventProvidedTicketsOverrideMutationOptions = Apollo.BaseMutationOptions<DeleteMaximumEventProvidedTicketsOverrideMutationData, DeleteMaximumEventProvidedTicketsOverrideMutationVariables>;
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
export type UpdateMaximumEventProvidedTicketsOverrideMutationFn = Apollo.MutationFunction<UpdateMaximumEventProvidedTicketsOverrideMutationData, UpdateMaximumEventProvidedTicketsOverrideMutationVariables>;

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
export function useUpdateMaximumEventProvidedTicketsOverrideMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMaximumEventProvidedTicketsOverrideMutationData, UpdateMaximumEventProvidedTicketsOverrideMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMaximumEventProvidedTicketsOverrideMutationData, UpdateMaximumEventProvidedTicketsOverrideMutationVariables>(UpdateMaximumEventProvidedTicketsOverrideDocument, options);
      }
export type UpdateMaximumEventProvidedTicketsOverrideMutationHookResult = ReturnType<typeof useUpdateMaximumEventProvidedTicketsOverrideMutation>;
export type UpdateMaximumEventProvidedTicketsOverrideMutationResult = Apollo.MutationResult<UpdateMaximumEventProvidedTicketsOverrideMutationData>;
export type UpdateMaximumEventProvidedTicketsOverrideMutationOptions = Apollo.BaseMutationOptions<UpdateMaximumEventProvidedTicketsOverrideMutationData, UpdateMaximumEventProvidedTicketsOverrideMutationVariables>;
export const UpdateEventAdminNotesDocument = gql`
    mutation UpdateEventAdminNotes($eventId: ID!, $adminNotes: String!) {
  updateEventAdminNotes(input: {id: $eventId, admin_notes: $adminNotes}) {
    event {
      id
      ...EventFields
    }
  }
}
    ${EventFieldsFragmentDoc}`;
export type UpdateEventAdminNotesMutationFn = Apollo.MutationFunction<UpdateEventAdminNotesMutationData, UpdateEventAdminNotesMutationVariables>;

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
export function useUpdateEventAdminNotesMutation(baseOptions?: Apollo.MutationHookOptions<UpdateEventAdminNotesMutationData, UpdateEventAdminNotesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateEventAdminNotesMutationData, UpdateEventAdminNotesMutationVariables>(UpdateEventAdminNotesDocument, options);
      }
export type UpdateEventAdminNotesMutationHookResult = ReturnType<typeof useUpdateEventAdminNotesMutation>;
export type UpdateEventAdminNotesMutationResult = Apollo.MutationResult<UpdateEventAdminNotesMutationData>;
export type UpdateEventAdminNotesMutationOptions = Apollo.BaseMutationOptions<UpdateEventAdminNotesMutationData, UpdateEventAdminNotesMutationVariables>;