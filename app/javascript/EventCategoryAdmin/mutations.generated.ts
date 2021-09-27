/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { EventCategoryFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CreateEventCategoryMutationVariables = Types.Exact<{
  eventCategory: Types.EventCategoryInput;
}>;


export type CreateEventCategoryMutationData = { __typename: 'Mutation', createEventCategory: { __typename: 'CreateEventCategoryPayload', event_category: { __typename: 'EventCategory', id: number, name: string, team_member_name: string, proposal_description?: Types.Maybe<string>, scheduling_ui: Types.SchedulingUi, default_color?: Types.Maybe<string>, signed_up_color?: Types.Maybe<string>, full_color?: Types.Maybe<string>, can_provide_tickets: boolean, events_paginated: { __typename: 'EventsPagination', total_entries: number }, department?: Types.Maybe<{ __typename: 'Department', id: number, name: string }>, event_form: { __typename: 'Form', id: number, title: string, form_type: Types.FormType }, event_proposal_form?: Types.Maybe<{ __typename: 'Form', id: number, title: string, form_type: Types.FormType }> } } };

export type UpdateEventCategoryMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
  eventCategory: Types.EventCategoryInput;
}>;


export type UpdateEventCategoryMutationData = { __typename: 'Mutation', updateEventCategory: { __typename: 'UpdateEventCategoryPayload', event_category: { __typename: 'EventCategory', id: number, name: string, team_member_name: string, proposal_description?: Types.Maybe<string>, scheduling_ui: Types.SchedulingUi, default_color?: Types.Maybe<string>, signed_up_color?: Types.Maybe<string>, full_color?: Types.Maybe<string>, can_provide_tickets: boolean, events_paginated: { __typename: 'EventsPagination', total_entries: number }, department?: Types.Maybe<{ __typename: 'Department', id: number, name: string }>, event_form: { __typename: 'Form', id: number, title: string, form_type: Types.FormType }, event_proposal_form?: Types.Maybe<{ __typename: 'Form', id: number, title: string, form_type: Types.FormType }> } } };

export type DeleteEventCategoryMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type DeleteEventCategoryMutationData = { __typename: 'Mutation', deleteEventCategory: { __typename: 'DeleteEventCategoryPayload', clientMutationId?: Types.Maybe<string> } };


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
export type CreateEventCategoryMutationFn = Apollo.MutationFunction<CreateEventCategoryMutationData, CreateEventCategoryMutationVariables>;

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
export function useCreateEventCategoryMutation(baseOptions?: Apollo.MutationHookOptions<CreateEventCategoryMutationData, CreateEventCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateEventCategoryMutationData, CreateEventCategoryMutationVariables>(CreateEventCategoryDocument, options);
      }
export type CreateEventCategoryMutationHookResult = ReturnType<typeof useCreateEventCategoryMutation>;
export type CreateEventCategoryMutationResult = Apollo.MutationResult<CreateEventCategoryMutationData>;
export type CreateEventCategoryMutationOptions = Apollo.BaseMutationOptions<CreateEventCategoryMutationData, CreateEventCategoryMutationVariables>;
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
export type UpdateEventCategoryMutationFn = Apollo.MutationFunction<UpdateEventCategoryMutationData, UpdateEventCategoryMutationVariables>;

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
export function useUpdateEventCategoryMutation(baseOptions?: Apollo.MutationHookOptions<UpdateEventCategoryMutationData, UpdateEventCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateEventCategoryMutationData, UpdateEventCategoryMutationVariables>(UpdateEventCategoryDocument, options);
      }
export type UpdateEventCategoryMutationHookResult = ReturnType<typeof useUpdateEventCategoryMutation>;
export type UpdateEventCategoryMutationResult = Apollo.MutationResult<UpdateEventCategoryMutationData>;
export type UpdateEventCategoryMutationOptions = Apollo.BaseMutationOptions<UpdateEventCategoryMutationData, UpdateEventCategoryMutationVariables>;
export const DeleteEventCategoryDocument = gql`
    mutation DeleteEventCategory($id: Int!) {
  deleteEventCategory(input: {id: $id}) {
    clientMutationId
  }
}
    `;
export type DeleteEventCategoryMutationFn = Apollo.MutationFunction<DeleteEventCategoryMutationData, DeleteEventCategoryMutationVariables>;

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
export function useDeleteEventCategoryMutation(baseOptions?: Apollo.MutationHookOptions<DeleteEventCategoryMutationData, DeleteEventCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteEventCategoryMutationData, DeleteEventCategoryMutationVariables>(DeleteEventCategoryDocument, options);
      }
export type DeleteEventCategoryMutationHookResult = ReturnType<typeof useDeleteEventCategoryMutation>;
export type DeleteEventCategoryMutationResult = Apollo.MutationResult<DeleteEventCategoryMutationData>;
export type DeleteEventCategoryMutationOptions = Apollo.BaseMutationOptions<DeleteEventCategoryMutationData, DeleteEventCategoryMutationVariables>;