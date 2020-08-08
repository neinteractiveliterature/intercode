/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { StandaloneEditEvent_EventFieldsFragment, StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFieldsFragment } from './queries.generated';
import { gql } from '@apollo/client';
import { StandaloneEditEvent_EventFieldsFragmentDoc, StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';


export type StandaloneDropEventMutationVariables = Types.Exact<{
  input: Types.DropEventInput;
}>;


export type StandaloneDropEventMutation = (
  { __typename?: 'Mutation' }
  & { dropEvent?: Types.Maybe<(
    { __typename?: 'DropEventPayload' }
    & { event: (
      { __typename?: 'Event' }
      & Pick<Types.Event, 'id' | 'status'>
    ) }
  )> }
);

export type StandaloneUpdateEventMutationVariables = Types.Exact<{
  input: Types.UpdateEventInput;
}>;


export type StandaloneUpdateEventMutation = (
  { __typename?: 'Mutation' }
  & { updateEvent?: Types.Maybe<(
    { __typename?: 'UpdateEventPayload' }
    & { event: (
      { __typename?: 'Event' }
      & Pick<Types.Event, 'id'>
      & StandaloneEditEvent_EventFieldsFragment
    ) }
  )> }
);

export type StandaloneCreateMaximumEventProvidedTicketsOverrideMutationVariables = Types.Exact<{
  input: Types.CreateMaximumEventProvidedTicketsOverrideInput;
}>;


export type StandaloneCreateMaximumEventProvidedTicketsOverrideMutation = (
  { __typename?: 'Mutation' }
  & { createMaximumEventProvidedTicketsOverride?: Types.Maybe<(
    { __typename?: 'CreateMaximumEventProvidedTicketsOverridePayload' }
    & { maximum_event_provided_tickets_override: (
      { __typename?: 'MaximumEventProvidedTicketsOverride' }
      & Pick<Types.MaximumEventProvidedTicketsOverride, 'id'>
      & StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFieldsFragment
    ) }
  )> }
);

export type StandaloneDeleteMaximumEventProvidedTicketsOverrideMutationVariables = Types.Exact<{
  input: Types.DeleteMaximumEventProvidedTicketsOverrideInput;
}>;


export type StandaloneDeleteMaximumEventProvidedTicketsOverrideMutation = (
  { __typename?: 'Mutation' }
  & { deleteMaximumEventProvidedTicketsOverride?: Types.Maybe<(
    { __typename?: 'DeleteMaximumEventProvidedTicketsOverridePayload' }
    & { maximum_event_provided_tickets_override: (
      { __typename?: 'MaximumEventProvidedTicketsOverride' }
      & Pick<Types.MaximumEventProvidedTicketsOverride, 'id'>
      & StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFieldsFragment
    ) }
  )> }
);

export type StandaloneUpdateMaximumEventProvidedTicketsOverrideMutationVariables = Types.Exact<{
  input: Types.UpdateMaximumEventProvidedTicketsOverrideInput;
}>;


export type StandaloneUpdateMaximumEventProvidedTicketsOverrideMutation = (
  { __typename?: 'Mutation' }
  & { updateMaximumEventProvidedTicketsOverride?: Types.Maybe<(
    { __typename?: 'UpdateMaximumEventProvidedTicketsOverridePayload' }
    & { maximum_event_provided_tickets_override: (
      { __typename?: 'MaximumEventProvidedTicketsOverride' }
      & Pick<Types.MaximumEventProvidedTicketsOverride, 'id'>
      & StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFieldsFragment
    ) }
  )> }
);


export const StandaloneDropEventDocument = gql`
    mutation StandaloneDropEvent($input: DropEventInput!) {
  dropEvent(input: $input) {
    event {
      id
      status
    }
  }
}
    `;
export type StandaloneDropEventMutationFn = Apollo.MutationFunction<StandaloneDropEventMutation, StandaloneDropEventMutationVariables>;

/**
 * __useStandaloneDropEventMutation__
 *
 * To run a mutation, you first call `useStandaloneDropEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStandaloneDropEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [standaloneDropEventMutation, { data, loading, error }] = useStandaloneDropEventMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useStandaloneDropEventMutation(baseOptions?: Apollo.MutationHookOptions<StandaloneDropEventMutation, StandaloneDropEventMutationVariables>) {
        return Apollo.useMutation<StandaloneDropEventMutation, StandaloneDropEventMutationVariables>(StandaloneDropEventDocument, baseOptions);
      }
export type StandaloneDropEventMutationHookResult = ReturnType<typeof useStandaloneDropEventMutation>;
export type StandaloneDropEventMutationResult = Apollo.MutationResult<StandaloneDropEventMutation>;
export type StandaloneDropEventMutationOptions = Apollo.BaseMutationOptions<StandaloneDropEventMutation, StandaloneDropEventMutationVariables>;
export const StandaloneUpdateEventDocument = gql`
    mutation StandaloneUpdateEvent($input: UpdateEventInput!) {
  updateEvent(input: $input) {
    event {
      id
      ...StandaloneEditEvent_EventFields
    }
  }
}
    ${StandaloneEditEvent_EventFieldsFragmentDoc}`;
export type StandaloneUpdateEventMutationFn = Apollo.MutationFunction<StandaloneUpdateEventMutation, StandaloneUpdateEventMutationVariables>;

/**
 * __useStandaloneUpdateEventMutation__
 *
 * To run a mutation, you first call `useStandaloneUpdateEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStandaloneUpdateEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [standaloneUpdateEventMutation, { data, loading, error }] = useStandaloneUpdateEventMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useStandaloneUpdateEventMutation(baseOptions?: Apollo.MutationHookOptions<StandaloneUpdateEventMutation, StandaloneUpdateEventMutationVariables>) {
        return Apollo.useMutation<StandaloneUpdateEventMutation, StandaloneUpdateEventMutationVariables>(StandaloneUpdateEventDocument, baseOptions);
      }
export type StandaloneUpdateEventMutationHookResult = ReturnType<typeof useStandaloneUpdateEventMutation>;
export type StandaloneUpdateEventMutationResult = Apollo.MutationResult<StandaloneUpdateEventMutation>;
export type StandaloneUpdateEventMutationOptions = Apollo.BaseMutationOptions<StandaloneUpdateEventMutation, StandaloneUpdateEventMutationVariables>;
export const StandaloneCreateMaximumEventProvidedTicketsOverrideDocument = gql`
    mutation StandaloneCreateMaximumEventProvidedTicketsOverride($input: CreateMaximumEventProvidedTicketsOverrideInput!) {
  createMaximumEventProvidedTicketsOverride(input: $input) {
    maximum_event_provided_tickets_override {
      id
      ...StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFields
    }
  }
}
    ${StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFieldsFragmentDoc}`;
export type StandaloneCreateMaximumEventProvidedTicketsOverrideMutationFn = Apollo.MutationFunction<StandaloneCreateMaximumEventProvidedTicketsOverrideMutation, StandaloneCreateMaximumEventProvidedTicketsOverrideMutationVariables>;

/**
 * __useStandaloneCreateMaximumEventProvidedTicketsOverrideMutation__
 *
 * To run a mutation, you first call `useStandaloneCreateMaximumEventProvidedTicketsOverrideMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStandaloneCreateMaximumEventProvidedTicketsOverrideMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [standaloneCreateMaximumEventProvidedTicketsOverrideMutation, { data, loading, error }] = useStandaloneCreateMaximumEventProvidedTicketsOverrideMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useStandaloneCreateMaximumEventProvidedTicketsOverrideMutation(baseOptions?: Apollo.MutationHookOptions<StandaloneCreateMaximumEventProvidedTicketsOverrideMutation, StandaloneCreateMaximumEventProvidedTicketsOverrideMutationVariables>) {
        return Apollo.useMutation<StandaloneCreateMaximumEventProvidedTicketsOverrideMutation, StandaloneCreateMaximumEventProvidedTicketsOverrideMutationVariables>(StandaloneCreateMaximumEventProvidedTicketsOverrideDocument, baseOptions);
      }
export type StandaloneCreateMaximumEventProvidedTicketsOverrideMutationHookResult = ReturnType<typeof useStandaloneCreateMaximumEventProvidedTicketsOverrideMutation>;
export type StandaloneCreateMaximumEventProvidedTicketsOverrideMutationResult = Apollo.MutationResult<StandaloneCreateMaximumEventProvidedTicketsOverrideMutation>;
export type StandaloneCreateMaximumEventProvidedTicketsOverrideMutationOptions = Apollo.BaseMutationOptions<StandaloneCreateMaximumEventProvidedTicketsOverrideMutation, StandaloneCreateMaximumEventProvidedTicketsOverrideMutationVariables>;
export const StandaloneDeleteMaximumEventProvidedTicketsOverrideDocument = gql`
    mutation StandaloneDeleteMaximumEventProvidedTicketsOverride($input: DeleteMaximumEventProvidedTicketsOverrideInput!) {
  deleteMaximumEventProvidedTicketsOverride(input: $input) {
    maximum_event_provided_tickets_override {
      id
      ...StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFields
    }
  }
}
    ${StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFieldsFragmentDoc}`;
export type StandaloneDeleteMaximumEventProvidedTicketsOverrideMutationFn = Apollo.MutationFunction<StandaloneDeleteMaximumEventProvidedTicketsOverrideMutation, StandaloneDeleteMaximumEventProvidedTicketsOverrideMutationVariables>;

/**
 * __useStandaloneDeleteMaximumEventProvidedTicketsOverrideMutation__
 *
 * To run a mutation, you first call `useStandaloneDeleteMaximumEventProvidedTicketsOverrideMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStandaloneDeleteMaximumEventProvidedTicketsOverrideMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [standaloneDeleteMaximumEventProvidedTicketsOverrideMutation, { data, loading, error }] = useStandaloneDeleteMaximumEventProvidedTicketsOverrideMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useStandaloneDeleteMaximumEventProvidedTicketsOverrideMutation(baseOptions?: Apollo.MutationHookOptions<StandaloneDeleteMaximumEventProvidedTicketsOverrideMutation, StandaloneDeleteMaximumEventProvidedTicketsOverrideMutationVariables>) {
        return Apollo.useMutation<StandaloneDeleteMaximumEventProvidedTicketsOverrideMutation, StandaloneDeleteMaximumEventProvidedTicketsOverrideMutationVariables>(StandaloneDeleteMaximumEventProvidedTicketsOverrideDocument, baseOptions);
      }
export type StandaloneDeleteMaximumEventProvidedTicketsOverrideMutationHookResult = ReturnType<typeof useStandaloneDeleteMaximumEventProvidedTicketsOverrideMutation>;
export type StandaloneDeleteMaximumEventProvidedTicketsOverrideMutationResult = Apollo.MutationResult<StandaloneDeleteMaximumEventProvidedTicketsOverrideMutation>;
export type StandaloneDeleteMaximumEventProvidedTicketsOverrideMutationOptions = Apollo.BaseMutationOptions<StandaloneDeleteMaximumEventProvidedTicketsOverrideMutation, StandaloneDeleteMaximumEventProvidedTicketsOverrideMutationVariables>;
export const StandaloneUpdateMaximumEventProvidedTicketsOverrideDocument = gql`
    mutation StandaloneUpdateMaximumEventProvidedTicketsOverride($input: UpdateMaximumEventProvidedTicketsOverrideInput!) {
  updateMaximumEventProvidedTicketsOverride(input: $input) {
    maximum_event_provided_tickets_override {
      id
      ...StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFields
    }
  }
}
    ${StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFieldsFragmentDoc}`;
export type StandaloneUpdateMaximumEventProvidedTicketsOverrideMutationFn = Apollo.MutationFunction<StandaloneUpdateMaximumEventProvidedTicketsOverrideMutation, StandaloneUpdateMaximumEventProvidedTicketsOverrideMutationVariables>;

/**
 * __useStandaloneUpdateMaximumEventProvidedTicketsOverrideMutation__
 *
 * To run a mutation, you first call `useStandaloneUpdateMaximumEventProvidedTicketsOverrideMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStandaloneUpdateMaximumEventProvidedTicketsOverrideMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [standaloneUpdateMaximumEventProvidedTicketsOverrideMutation, { data, loading, error }] = useStandaloneUpdateMaximumEventProvidedTicketsOverrideMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useStandaloneUpdateMaximumEventProvidedTicketsOverrideMutation(baseOptions?: Apollo.MutationHookOptions<StandaloneUpdateMaximumEventProvidedTicketsOverrideMutation, StandaloneUpdateMaximumEventProvidedTicketsOverrideMutationVariables>) {
        return Apollo.useMutation<StandaloneUpdateMaximumEventProvidedTicketsOverrideMutation, StandaloneUpdateMaximumEventProvidedTicketsOverrideMutationVariables>(StandaloneUpdateMaximumEventProvidedTicketsOverrideDocument, baseOptions);
      }
export type StandaloneUpdateMaximumEventProvidedTicketsOverrideMutationHookResult = ReturnType<typeof useStandaloneUpdateMaximumEventProvidedTicketsOverrideMutation>;
export type StandaloneUpdateMaximumEventProvidedTicketsOverrideMutationResult = Apollo.MutationResult<StandaloneUpdateMaximumEventProvidedTicketsOverrideMutation>;
export type StandaloneUpdateMaximumEventProvidedTicketsOverrideMutationOptions = Apollo.BaseMutationOptions<StandaloneUpdateMaximumEventProvidedTicketsOverrideMutation, StandaloneUpdateMaximumEventProvidedTicketsOverrideMutationVariables>;