/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { EventFieldsFragment, RunFieldsFragment, MaximumEventProvidedTicketsOverrideFieldsFragment } from './queries.generated';
import gql from 'graphql-tag';
import { EventFieldsFragmentDoc, RunFieldsFragmentDoc, MaximumEventProvidedTicketsOverrideFieldsFragmentDoc } from './queries.generated';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };


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