/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { EventFieldsFragment, RunFieldsFragment, MaximumEventProvidedTicketsOverrideFieldsFragment } from './queries.generated';
import { gql } from '@apollo/client';
import { EventFieldsFragmentDoc, RunFieldsFragmentDoc, MaximumEventProvidedTicketsOverrideFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
export type CreateEventMutationVariables = Types.Exact<{
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

export type CreateFillerEventMutationVariables = Types.Exact<{
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

export type DropEventMutationVariables = Types.Exact<{
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

export type RestoreDroppedEventMutationVariables = Types.Exact<{
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

export type UpdateEventMutationVariables = Types.Exact<{
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

export type CreateRunMutationVariables = Types.Exact<{
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

export type CreateMultipleRunsMutationVariables = Types.Exact<{
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

export type UpdateRunMutationVariables = Types.Exact<{
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

export type DeleteRunMutationVariables = Types.Exact<{
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

export type CreateMaximumEventProvidedTicketsOverrideMutationVariables = Types.Exact<{
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

export type DeleteMaximumEventProvidedTicketsOverrideMutationVariables = Types.Exact<{
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

export type UpdateMaximumEventProvidedTicketsOverrideMutationVariables = Types.Exact<{
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

export type UpdateEventAdminNotesMutationVariables = Types.Exact<{
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
export type CreateEventMutationFn = Apollo.MutationFunction<CreateEventMutation, CreateEventMutationVariables>;

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
export function useCreateEventMutation(baseOptions?: Apollo.MutationHookOptions<CreateEventMutation, CreateEventMutationVariables>) {
        return Apollo.useMutation<CreateEventMutation, CreateEventMutationVariables>(CreateEventDocument, baseOptions);
      }
export type CreateEventMutationHookResult = ReturnType<typeof useCreateEventMutation>;
export type CreateEventMutationResult = Apollo.MutationResult<CreateEventMutation>;
export type CreateEventMutationOptions = Apollo.BaseMutationOptions<CreateEventMutation, CreateEventMutationVariables>;
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
export type CreateFillerEventMutationFn = Apollo.MutationFunction<CreateFillerEventMutation, CreateFillerEventMutationVariables>;

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
export function useCreateFillerEventMutation(baseOptions?: Apollo.MutationHookOptions<CreateFillerEventMutation, CreateFillerEventMutationVariables>) {
        return Apollo.useMutation<CreateFillerEventMutation, CreateFillerEventMutationVariables>(CreateFillerEventDocument, baseOptions);
      }
export type CreateFillerEventMutationHookResult = ReturnType<typeof useCreateFillerEventMutation>;
export type CreateFillerEventMutationResult = Apollo.MutationResult<CreateFillerEventMutation>;
export type CreateFillerEventMutationOptions = Apollo.BaseMutationOptions<CreateFillerEventMutation, CreateFillerEventMutationVariables>;
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
export type DropEventMutationFn = Apollo.MutationFunction<DropEventMutation, DropEventMutationVariables>;

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
export function useDropEventMutation(baseOptions?: Apollo.MutationHookOptions<DropEventMutation, DropEventMutationVariables>) {
        return Apollo.useMutation<DropEventMutation, DropEventMutationVariables>(DropEventDocument, baseOptions);
      }
export type DropEventMutationHookResult = ReturnType<typeof useDropEventMutation>;
export type DropEventMutationResult = Apollo.MutationResult<DropEventMutation>;
export type DropEventMutationOptions = Apollo.BaseMutationOptions<DropEventMutation, DropEventMutationVariables>;
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
export type RestoreDroppedEventMutationFn = Apollo.MutationFunction<RestoreDroppedEventMutation, RestoreDroppedEventMutationVariables>;

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
export function useRestoreDroppedEventMutation(baseOptions?: Apollo.MutationHookOptions<RestoreDroppedEventMutation, RestoreDroppedEventMutationVariables>) {
        return Apollo.useMutation<RestoreDroppedEventMutation, RestoreDroppedEventMutationVariables>(RestoreDroppedEventDocument, baseOptions);
      }
export type RestoreDroppedEventMutationHookResult = ReturnType<typeof useRestoreDroppedEventMutation>;
export type RestoreDroppedEventMutationResult = Apollo.MutationResult<RestoreDroppedEventMutation>;
export type RestoreDroppedEventMutationOptions = Apollo.BaseMutationOptions<RestoreDroppedEventMutation, RestoreDroppedEventMutationVariables>;
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
export type UpdateEventMutationFn = Apollo.MutationFunction<UpdateEventMutation, UpdateEventMutationVariables>;

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
export function useUpdateEventMutation(baseOptions?: Apollo.MutationHookOptions<UpdateEventMutation, UpdateEventMutationVariables>) {
        return Apollo.useMutation<UpdateEventMutation, UpdateEventMutationVariables>(UpdateEventDocument, baseOptions);
      }
export type UpdateEventMutationHookResult = ReturnType<typeof useUpdateEventMutation>;
export type UpdateEventMutationResult = Apollo.MutationResult<UpdateEventMutation>;
export type UpdateEventMutationOptions = Apollo.BaseMutationOptions<UpdateEventMutation, UpdateEventMutationVariables>;
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
export type CreateRunMutationFn = Apollo.MutationFunction<CreateRunMutation, CreateRunMutationVariables>;

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
export function useCreateRunMutation(baseOptions?: Apollo.MutationHookOptions<CreateRunMutation, CreateRunMutationVariables>) {
        return Apollo.useMutation<CreateRunMutation, CreateRunMutationVariables>(CreateRunDocument, baseOptions);
      }
export type CreateRunMutationHookResult = ReturnType<typeof useCreateRunMutation>;
export type CreateRunMutationResult = Apollo.MutationResult<CreateRunMutation>;
export type CreateRunMutationOptions = Apollo.BaseMutationOptions<CreateRunMutation, CreateRunMutationVariables>;
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
export type CreateMultipleRunsMutationFn = Apollo.MutationFunction<CreateMultipleRunsMutation, CreateMultipleRunsMutationVariables>;

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
export function useCreateMultipleRunsMutation(baseOptions?: Apollo.MutationHookOptions<CreateMultipleRunsMutation, CreateMultipleRunsMutationVariables>) {
        return Apollo.useMutation<CreateMultipleRunsMutation, CreateMultipleRunsMutationVariables>(CreateMultipleRunsDocument, baseOptions);
      }
export type CreateMultipleRunsMutationHookResult = ReturnType<typeof useCreateMultipleRunsMutation>;
export type CreateMultipleRunsMutationResult = Apollo.MutationResult<CreateMultipleRunsMutation>;
export type CreateMultipleRunsMutationOptions = Apollo.BaseMutationOptions<CreateMultipleRunsMutation, CreateMultipleRunsMutationVariables>;
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
export type UpdateRunMutationFn = Apollo.MutationFunction<UpdateRunMutation, UpdateRunMutationVariables>;

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
export function useUpdateRunMutation(baseOptions?: Apollo.MutationHookOptions<UpdateRunMutation, UpdateRunMutationVariables>) {
        return Apollo.useMutation<UpdateRunMutation, UpdateRunMutationVariables>(UpdateRunDocument, baseOptions);
      }
export type UpdateRunMutationHookResult = ReturnType<typeof useUpdateRunMutation>;
export type UpdateRunMutationResult = Apollo.MutationResult<UpdateRunMutation>;
export type UpdateRunMutationOptions = Apollo.BaseMutationOptions<UpdateRunMutation, UpdateRunMutationVariables>;
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
export type DeleteRunMutationFn = Apollo.MutationFunction<DeleteRunMutation, DeleteRunMutationVariables>;

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
export function useDeleteRunMutation(baseOptions?: Apollo.MutationHookOptions<DeleteRunMutation, DeleteRunMutationVariables>) {
        return Apollo.useMutation<DeleteRunMutation, DeleteRunMutationVariables>(DeleteRunDocument, baseOptions);
      }
export type DeleteRunMutationHookResult = ReturnType<typeof useDeleteRunMutation>;
export type DeleteRunMutationResult = Apollo.MutationResult<DeleteRunMutation>;
export type DeleteRunMutationOptions = Apollo.BaseMutationOptions<DeleteRunMutation, DeleteRunMutationVariables>;
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
export type CreateMaximumEventProvidedTicketsOverrideMutationFn = Apollo.MutationFunction<CreateMaximumEventProvidedTicketsOverrideMutation, CreateMaximumEventProvidedTicketsOverrideMutationVariables>;

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
export function useCreateMaximumEventProvidedTicketsOverrideMutation(baseOptions?: Apollo.MutationHookOptions<CreateMaximumEventProvidedTicketsOverrideMutation, CreateMaximumEventProvidedTicketsOverrideMutationVariables>) {
        return Apollo.useMutation<CreateMaximumEventProvidedTicketsOverrideMutation, CreateMaximumEventProvidedTicketsOverrideMutationVariables>(CreateMaximumEventProvidedTicketsOverrideDocument, baseOptions);
      }
export type CreateMaximumEventProvidedTicketsOverrideMutationHookResult = ReturnType<typeof useCreateMaximumEventProvidedTicketsOverrideMutation>;
export type CreateMaximumEventProvidedTicketsOverrideMutationResult = Apollo.MutationResult<CreateMaximumEventProvidedTicketsOverrideMutation>;
export type CreateMaximumEventProvidedTicketsOverrideMutationOptions = Apollo.BaseMutationOptions<CreateMaximumEventProvidedTicketsOverrideMutation, CreateMaximumEventProvidedTicketsOverrideMutationVariables>;
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
export type DeleteMaximumEventProvidedTicketsOverrideMutationFn = Apollo.MutationFunction<DeleteMaximumEventProvidedTicketsOverrideMutation, DeleteMaximumEventProvidedTicketsOverrideMutationVariables>;

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
export function useDeleteMaximumEventProvidedTicketsOverrideMutation(baseOptions?: Apollo.MutationHookOptions<DeleteMaximumEventProvidedTicketsOverrideMutation, DeleteMaximumEventProvidedTicketsOverrideMutationVariables>) {
        return Apollo.useMutation<DeleteMaximumEventProvidedTicketsOverrideMutation, DeleteMaximumEventProvidedTicketsOverrideMutationVariables>(DeleteMaximumEventProvidedTicketsOverrideDocument, baseOptions);
      }
export type DeleteMaximumEventProvidedTicketsOverrideMutationHookResult = ReturnType<typeof useDeleteMaximumEventProvidedTicketsOverrideMutation>;
export type DeleteMaximumEventProvidedTicketsOverrideMutationResult = Apollo.MutationResult<DeleteMaximumEventProvidedTicketsOverrideMutation>;
export type DeleteMaximumEventProvidedTicketsOverrideMutationOptions = Apollo.BaseMutationOptions<DeleteMaximumEventProvidedTicketsOverrideMutation, DeleteMaximumEventProvidedTicketsOverrideMutationVariables>;
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
export type UpdateMaximumEventProvidedTicketsOverrideMutationFn = Apollo.MutationFunction<UpdateMaximumEventProvidedTicketsOverrideMutation, UpdateMaximumEventProvidedTicketsOverrideMutationVariables>;

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
export function useUpdateMaximumEventProvidedTicketsOverrideMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMaximumEventProvidedTicketsOverrideMutation, UpdateMaximumEventProvidedTicketsOverrideMutationVariables>) {
        return Apollo.useMutation<UpdateMaximumEventProvidedTicketsOverrideMutation, UpdateMaximumEventProvidedTicketsOverrideMutationVariables>(UpdateMaximumEventProvidedTicketsOverrideDocument, baseOptions);
      }
export type UpdateMaximumEventProvidedTicketsOverrideMutationHookResult = ReturnType<typeof useUpdateMaximumEventProvidedTicketsOverrideMutation>;
export type UpdateMaximumEventProvidedTicketsOverrideMutationResult = Apollo.MutationResult<UpdateMaximumEventProvidedTicketsOverrideMutation>;
export type UpdateMaximumEventProvidedTicketsOverrideMutationOptions = Apollo.BaseMutationOptions<UpdateMaximumEventProvidedTicketsOverrideMutation, UpdateMaximumEventProvidedTicketsOverrideMutationVariables>;
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
export type UpdateEventAdminNotesMutationFn = Apollo.MutationFunction<UpdateEventAdminNotesMutation, UpdateEventAdminNotesMutationVariables>;

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
export function useUpdateEventAdminNotesMutation(baseOptions?: Apollo.MutationHookOptions<UpdateEventAdminNotesMutation, UpdateEventAdminNotesMutationVariables>) {
        return Apollo.useMutation<UpdateEventAdminNotesMutation, UpdateEventAdminNotesMutationVariables>(UpdateEventAdminNotesDocument, baseOptions);
      }
export type UpdateEventAdminNotesMutationHookResult = ReturnType<typeof useUpdateEventAdminNotesMutation>;
export type UpdateEventAdminNotesMutationResult = Apollo.MutationResult<UpdateEventAdminNotesMutation>;
export type UpdateEventAdminNotesMutationOptions = Apollo.BaseMutationOptions<UpdateEventAdminNotesMutation, UpdateEventAdminNotesMutationVariables>;