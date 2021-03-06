/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { StandaloneEditEvent_EventFieldsFragment, StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFieldsFragment } from './queries.generated';
import { gql } from '@apollo/client';
import { StandaloneEditEvent_EventFieldsFragmentDoc, StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type StandaloneDropEventMutationVariables = Types.Exact<{
  input: Types.DropEventInput;
}>;


export type StandaloneDropEventMutationData = (
  { __typename: 'Mutation' }
  & { dropEvent?: Types.Maybe<(
    { __typename: 'DropEventPayload' }
    & { event: (
      { __typename: 'Event' }
      & Pick<Types.Event, 'id' | 'status'>
    ) }
  )> }
);

export type StandaloneUpdateEventMutationVariables = Types.Exact<{
  input: Types.UpdateEventInput;
}>;


export type StandaloneUpdateEventMutationData = (
  { __typename: 'Mutation' }
  & { updateEvent?: Types.Maybe<(
    { __typename: 'UpdateEventPayload' }
    & { event: (
      { __typename: 'Event' }
      & Pick<Types.Event, 'id'>
      & StandaloneEditEvent_EventFieldsFragment
    ) }
  )> }
);

export type StandaloneCreateMaximumEventProvidedTicketsOverrideMutationVariables = Types.Exact<{
  input: Types.CreateMaximumEventProvidedTicketsOverrideInput;
}>;


export type StandaloneCreateMaximumEventProvidedTicketsOverrideMutationData = (
  { __typename: 'Mutation' }
  & { createMaximumEventProvidedTicketsOverride?: Types.Maybe<(
    { __typename: 'CreateMaximumEventProvidedTicketsOverridePayload' }
    & { maximum_event_provided_tickets_override: (
      { __typename: 'MaximumEventProvidedTicketsOverride' }
      & Pick<Types.MaximumEventProvidedTicketsOverride, 'id'>
      & StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFieldsFragment
    ) }
  )> }
);

export type StandaloneDeleteMaximumEventProvidedTicketsOverrideMutationVariables = Types.Exact<{
  input: Types.DeleteMaximumEventProvidedTicketsOverrideInput;
}>;


export type StandaloneDeleteMaximumEventProvidedTicketsOverrideMutationData = (
  { __typename: 'Mutation' }
  & { deleteMaximumEventProvidedTicketsOverride?: Types.Maybe<(
    { __typename: 'DeleteMaximumEventProvidedTicketsOverridePayload' }
    & { maximum_event_provided_tickets_override: (
      { __typename: 'MaximumEventProvidedTicketsOverride' }
      & Pick<Types.MaximumEventProvidedTicketsOverride, 'id'>
      & StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFieldsFragment
    ) }
  )> }
);

export type StandaloneUpdateMaximumEventProvidedTicketsOverrideMutationVariables = Types.Exact<{
  input: Types.UpdateMaximumEventProvidedTicketsOverrideInput;
}>;


export type StandaloneUpdateMaximumEventProvidedTicketsOverrideMutationData = (
  { __typename: 'Mutation' }
  & { updateMaximumEventProvidedTicketsOverride?: Types.Maybe<(
    { __typename: 'UpdateMaximumEventProvidedTicketsOverridePayload' }
    & { maximum_event_provided_tickets_override: (
      { __typename: 'MaximumEventProvidedTicketsOverride' }
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
export type StandaloneDropEventMutationFn = Apollo.MutationFunction<StandaloneDropEventMutationData, StandaloneDropEventMutationVariables>;

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
export function useStandaloneDropEventMutation(baseOptions?: Apollo.MutationHookOptions<StandaloneDropEventMutationData, StandaloneDropEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<StandaloneDropEventMutationData, StandaloneDropEventMutationVariables>(StandaloneDropEventDocument, options);
      }
export type StandaloneDropEventMutationHookResult = ReturnType<typeof useStandaloneDropEventMutation>;
export type StandaloneDropEventMutationResult = Apollo.MutationResult<StandaloneDropEventMutationData>;
export type StandaloneDropEventMutationOptions = Apollo.BaseMutationOptions<StandaloneDropEventMutationData, StandaloneDropEventMutationVariables>;
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
export type StandaloneUpdateEventMutationFn = Apollo.MutationFunction<StandaloneUpdateEventMutationData, StandaloneUpdateEventMutationVariables>;

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
export function useStandaloneUpdateEventMutation(baseOptions?: Apollo.MutationHookOptions<StandaloneUpdateEventMutationData, StandaloneUpdateEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<StandaloneUpdateEventMutationData, StandaloneUpdateEventMutationVariables>(StandaloneUpdateEventDocument, options);
      }
export type StandaloneUpdateEventMutationHookResult = ReturnType<typeof useStandaloneUpdateEventMutation>;
export type StandaloneUpdateEventMutationResult = Apollo.MutationResult<StandaloneUpdateEventMutationData>;
export type StandaloneUpdateEventMutationOptions = Apollo.BaseMutationOptions<StandaloneUpdateEventMutationData, StandaloneUpdateEventMutationVariables>;
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
export type StandaloneCreateMaximumEventProvidedTicketsOverrideMutationFn = Apollo.MutationFunction<StandaloneCreateMaximumEventProvidedTicketsOverrideMutationData, StandaloneCreateMaximumEventProvidedTicketsOverrideMutationVariables>;

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
export function useStandaloneCreateMaximumEventProvidedTicketsOverrideMutation(baseOptions?: Apollo.MutationHookOptions<StandaloneCreateMaximumEventProvidedTicketsOverrideMutationData, StandaloneCreateMaximumEventProvidedTicketsOverrideMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<StandaloneCreateMaximumEventProvidedTicketsOverrideMutationData, StandaloneCreateMaximumEventProvidedTicketsOverrideMutationVariables>(StandaloneCreateMaximumEventProvidedTicketsOverrideDocument, options);
      }
export type StandaloneCreateMaximumEventProvidedTicketsOverrideMutationHookResult = ReturnType<typeof useStandaloneCreateMaximumEventProvidedTicketsOverrideMutation>;
export type StandaloneCreateMaximumEventProvidedTicketsOverrideMutationResult = Apollo.MutationResult<StandaloneCreateMaximumEventProvidedTicketsOverrideMutationData>;
export type StandaloneCreateMaximumEventProvidedTicketsOverrideMutationOptions = Apollo.BaseMutationOptions<StandaloneCreateMaximumEventProvidedTicketsOverrideMutationData, StandaloneCreateMaximumEventProvidedTicketsOverrideMutationVariables>;
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
export type StandaloneDeleteMaximumEventProvidedTicketsOverrideMutationFn = Apollo.MutationFunction<StandaloneDeleteMaximumEventProvidedTicketsOverrideMutationData, StandaloneDeleteMaximumEventProvidedTicketsOverrideMutationVariables>;

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
export function useStandaloneDeleteMaximumEventProvidedTicketsOverrideMutation(baseOptions?: Apollo.MutationHookOptions<StandaloneDeleteMaximumEventProvidedTicketsOverrideMutationData, StandaloneDeleteMaximumEventProvidedTicketsOverrideMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<StandaloneDeleteMaximumEventProvidedTicketsOverrideMutationData, StandaloneDeleteMaximumEventProvidedTicketsOverrideMutationVariables>(StandaloneDeleteMaximumEventProvidedTicketsOverrideDocument, options);
      }
export type StandaloneDeleteMaximumEventProvidedTicketsOverrideMutationHookResult = ReturnType<typeof useStandaloneDeleteMaximumEventProvidedTicketsOverrideMutation>;
export type StandaloneDeleteMaximumEventProvidedTicketsOverrideMutationResult = Apollo.MutationResult<StandaloneDeleteMaximumEventProvidedTicketsOverrideMutationData>;
export type StandaloneDeleteMaximumEventProvidedTicketsOverrideMutationOptions = Apollo.BaseMutationOptions<StandaloneDeleteMaximumEventProvidedTicketsOverrideMutationData, StandaloneDeleteMaximumEventProvidedTicketsOverrideMutationVariables>;
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
export type StandaloneUpdateMaximumEventProvidedTicketsOverrideMutationFn = Apollo.MutationFunction<StandaloneUpdateMaximumEventProvidedTicketsOverrideMutationData, StandaloneUpdateMaximumEventProvidedTicketsOverrideMutationVariables>;

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
export function useStandaloneUpdateMaximumEventProvidedTicketsOverrideMutation(baseOptions?: Apollo.MutationHookOptions<StandaloneUpdateMaximumEventProvidedTicketsOverrideMutationData, StandaloneUpdateMaximumEventProvidedTicketsOverrideMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<StandaloneUpdateMaximumEventProvidedTicketsOverrideMutationData, StandaloneUpdateMaximumEventProvidedTicketsOverrideMutationVariables>(StandaloneUpdateMaximumEventProvidedTicketsOverrideDocument, options);
      }
export type StandaloneUpdateMaximumEventProvidedTicketsOverrideMutationHookResult = ReturnType<typeof useStandaloneUpdateMaximumEventProvidedTicketsOverrideMutation>;
export type StandaloneUpdateMaximumEventProvidedTicketsOverrideMutationResult = Apollo.MutationResult<StandaloneUpdateMaximumEventProvidedTicketsOverrideMutationData>;
export type StandaloneUpdateMaximumEventProvidedTicketsOverrideMutationOptions = Apollo.BaseMutationOptions<StandaloneUpdateMaximumEventProvidedTicketsOverrideMutationData, StandaloneUpdateMaximumEventProvidedTicketsOverrideMutationVariables>;