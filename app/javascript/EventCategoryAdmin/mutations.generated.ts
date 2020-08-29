/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { EventCategoryFieldsFragment } from './queries.generated';
import { gql } from '@apollo/client';
import { EventCategoryFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
export type CreateEventCategoryMutationVariables = Types.Exact<{
  eventCategory: Types.EventCategoryInput;
}>;


export type CreateEventCategoryMutation = (
  { __typename?: 'Mutation' }
  & { createEventCategory?: Types.Maybe<(
    { __typename?: 'CreateEventCategoryPayload' }
    & { event_category: (
      { __typename?: 'EventCategory' }
      & Pick<Types.EventCategory, 'id'>
      & EventCategoryFieldsFragment
    ) }
  )> }
);

export type UpdateEventCategoryMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
  eventCategory: Types.EventCategoryInput;
}>;


export type UpdateEventCategoryMutation = (
  { __typename?: 'Mutation' }
  & { updateEventCategory?: Types.Maybe<(
    { __typename?: 'UpdateEventCategoryPayload' }
    & { event_category: (
      { __typename?: 'EventCategory' }
      & Pick<Types.EventCategory, 'id'>
      & EventCategoryFieldsFragment
    ) }
  )> }
);

export type DeleteEventCategoryMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type DeleteEventCategoryMutation = (
  { __typename?: 'Mutation' }
  & { deleteEventCategory?: Types.Maybe<(
    { __typename?: 'DeleteEventCategoryPayload' }
    & Pick<Types.DeleteEventCategoryPayload, 'clientMutationId'>
  )> }
);


export const CreateEventCategoryDocument = gql`
    mutation CreateEventCategory($eventCategory: EventCategoryInput!) {
  createEventCategory(input: {event_category: $eventCategory}) {
    event_category {
      id
      ...EventCategoryFields
    }
  }
}
    ${EventCategoryFieldsFragmentDoc}`;
export type CreateEventCategoryMutationFn = Apollo.MutationFunction<CreateEventCategoryMutation, CreateEventCategoryMutationVariables>;

/**
 * __useCreateEventCategoryMutation__
 *
 * To run a mutation, you first call `useCreateEventCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEventCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEventCategoryMutation, { data, loading, error }] = useCreateEventCategoryMutation({
 *   variables: {
 *      eventCategory: // value for 'eventCategory'
 *   },
 * });
 */
export function useCreateEventCategoryMutation(baseOptions?: Apollo.MutationHookOptions<CreateEventCategoryMutation, CreateEventCategoryMutationVariables>) {
        return Apollo.useMutation<CreateEventCategoryMutation, CreateEventCategoryMutationVariables>(CreateEventCategoryDocument, baseOptions);
      }
export type CreateEventCategoryMutationHookResult = ReturnType<typeof useCreateEventCategoryMutation>;
export type CreateEventCategoryMutationResult = Apollo.MutationResult<CreateEventCategoryMutation>;
export type CreateEventCategoryMutationOptions = Apollo.BaseMutationOptions<CreateEventCategoryMutation, CreateEventCategoryMutationVariables>;
export const UpdateEventCategoryDocument = gql`
    mutation UpdateEventCategory($id: Int!, $eventCategory: EventCategoryInput!) {
  updateEventCategory(input: {id: $id, event_category: $eventCategory}) {
    event_category {
      id
      ...EventCategoryFields
    }
  }
}
    ${EventCategoryFieldsFragmentDoc}`;
export type UpdateEventCategoryMutationFn = Apollo.MutationFunction<UpdateEventCategoryMutation, UpdateEventCategoryMutationVariables>;

/**
 * __useUpdateEventCategoryMutation__
 *
 * To run a mutation, you first call `useUpdateEventCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateEventCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateEventCategoryMutation, { data, loading, error }] = useUpdateEventCategoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *      eventCategory: // value for 'eventCategory'
 *   },
 * });
 */
export function useUpdateEventCategoryMutation(baseOptions?: Apollo.MutationHookOptions<UpdateEventCategoryMutation, UpdateEventCategoryMutationVariables>) {
        return Apollo.useMutation<UpdateEventCategoryMutation, UpdateEventCategoryMutationVariables>(UpdateEventCategoryDocument, baseOptions);
      }
export type UpdateEventCategoryMutationHookResult = ReturnType<typeof useUpdateEventCategoryMutation>;
export type UpdateEventCategoryMutationResult = Apollo.MutationResult<UpdateEventCategoryMutation>;
export type UpdateEventCategoryMutationOptions = Apollo.BaseMutationOptions<UpdateEventCategoryMutation, UpdateEventCategoryMutationVariables>;
export const DeleteEventCategoryDocument = gql`
    mutation DeleteEventCategory($id: Int!) {
  deleteEventCategory(input: {id: $id}) {
    clientMutationId
  }
}
    `;
export type DeleteEventCategoryMutationFn = Apollo.MutationFunction<DeleteEventCategoryMutation, DeleteEventCategoryMutationVariables>;

/**
 * __useDeleteEventCategoryMutation__
 *
 * To run a mutation, you first call `useDeleteEventCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteEventCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteEventCategoryMutation, { data, loading, error }] = useDeleteEventCategoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteEventCategoryMutation(baseOptions?: Apollo.MutationHookOptions<DeleteEventCategoryMutation, DeleteEventCategoryMutationVariables>) {
        return Apollo.useMutation<DeleteEventCategoryMutation, DeleteEventCategoryMutationVariables>(DeleteEventCategoryDocument, baseOptions);
      }
export type DeleteEventCategoryMutationHookResult = ReturnType<typeof useDeleteEventCategoryMutation>;
export type DeleteEventCategoryMutationResult = Apollo.MutationResult<DeleteEventCategoryMutation>;
export type DeleteEventCategoryMutationOptions = Apollo.BaseMutationOptions<DeleteEventCategoryMutation, DeleteEventCategoryMutationVariables>;