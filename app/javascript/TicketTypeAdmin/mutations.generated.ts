/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { TicketTypeAdmin_TicketTypeFieldsFragment } from './queries.generated';
import { gql } from '@apollo/client';
import { TicketTypeAdmin_TicketTypeFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
export type CreateTicketTypeMutationVariables = Types.Exact<{
  input: Types.CreateTicketTypeInput;
}>;


export type CreateTicketTypeMutation = (
  { __typename?: 'Mutation' }
  & { createTicketType?: Types.Maybe<(
    { __typename?: 'CreateTicketTypePayload' }
    & { ticket_type: (
      { __typename?: 'TicketType' }
      & Pick<Types.TicketType, 'id'>
      & TicketTypeAdmin_TicketTypeFieldsFragment
    ) }
  )> }
);

export type UpdateTicketTypeMutationVariables = Types.Exact<{
  input: Types.UpdateTicketTypeInput;
}>;


export type UpdateTicketTypeMutation = (
  { __typename?: 'Mutation' }
  & { updateTicketType?: Types.Maybe<(
    { __typename?: 'UpdateTicketTypePayload' }
    & { ticket_type: (
      { __typename?: 'TicketType' }
      & Pick<Types.TicketType, 'id'>
      & TicketTypeAdmin_TicketTypeFieldsFragment
    ) }
  )> }
);

export type DeleteTicketTypeMutationVariables = Types.Exact<{
  input: Types.DeleteTicketTypeInput;
}>;


export type DeleteTicketTypeMutation = (
  { __typename?: 'Mutation' }
  & { deleteTicketType?: Types.Maybe<(
    { __typename?: 'DeleteTicketTypePayload' }
    & { ticket_type: (
      { __typename?: 'TicketType' }
      & Pick<Types.TicketType, 'id'>
    ) }
  )> }
);


export const CreateTicketTypeDocument = gql`
    mutation CreateTicketType($input: CreateTicketTypeInput!) {
  createTicketType(input: $input) {
    ticket_type {
      id
      ...TicketTypeAdmin_TicketTypeFields
    }
  }
}
    ${TicketTypeAdmin_TicketTypeFieldsFragmentDoc}`;
export type CreateTicketTypeMutationFn = Apollo.MutationFunction<CreateTicketTypeMutation, CreateTicketTypeMutationVariables>;

/**
 * __useCreateTicketTypeMutation__
 *
 * To run a mutation, you first call `useCreateTicketTypeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTicketTypeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTicketTypeMutation, { data, loading, error }] = useCreateTicketTypeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTicketTypeMutation(baseOptions?: Apollo.MutationHookOptions<CreateTicketTypeMutation, CreateTicketTypeMutationVariables>) {
        return Apollo.useMutation<CreateTicketTypeMutation, CreateTicketTypeMutationVariables>(CreateTicketTypeDocument, baseOptions);
      }
export type CreateTicketTypeMutationHookResult = ReturnType<typeof useCreateTicketTypeMutation>;
export type CreateTicketTypeMutationResult = Apollo.MutationResult<CreateTicketTypeMutation>;
export type CreateTicketTypeMutationOptions = Apollo.BaseMutationOptions<CreateTicketTypeMutation, CreateTicketTypeMutationVariables>;
export const UpdateTicketTypeDocument = gql`
    mutation UpdateTicketType($input: UpdateTicketTypeInput!) {
  updateTicketType(input: $input) {
    ticket_type {
      id
      ...TicketTypeAdmin_TicketTypeFields
    }
  }
}
    ${TicketTypeAdmin_TicketTypeFieldsFragmentDoc}`;
export type UpdateTicketTypeMutationFn = Apollo.MutationFunction<UpdateTicketTypeMutation, UpdateTicketTypeMutationVariables>;

/**
 * __useUpdateTicketTypeMutation__
 *
 * To run a mutation, you first call `useUpdateTicketTypeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTicketTypeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTicketTypeMutation, { data, loading, error }] = useUpdateTicketTypeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTicketTypeMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTicketTypeMutation, UpdateTicketTypeMutationVariables>) {
        return Apollo.useMutation<UpdateTicketTypeMutation, UpdateTicketTypeMutationVariables>(UpdateTicketTypeDocument, baseOptions);
      }
export type UpdateTicketTypeMutationHookResult = ReturnType<typeof useUpdateTicketTypeMutation>;
export type UpdateTicketTypeMutationResult = Apollo.MutationResult<UpdateTicketTypeMutation>;
export type UpdateTicketTypeMutationOptions = Apollo.BaseMutationOptions<UpdateTicketTypeMutation, UpdateTicketTypeMutationVariables>;
export const DeleteTicketTypeDocument = gql`
    mutation DeleteTicketType($input: DeleteTicketTypeInput!) {
  deleteTicketType(input: $input) {
    ticket_type {
      id
    }
  }
}
    `;
export type DeleteTicketTypeMutationFn = Apollo.MutationFunction<DeleteTicketTypeMutation, DeleteTicketTypeMutationVariables>;

/**
 * __useDeleteTicketTypeMutation__
 *
 * To run a mutation, you first call `useDeleteTicketTypeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTicketTypeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTicketTypeMutation, { data, loading, error }] = useDeleteTicketTypeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteTicketTypeMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTicketTypeMutation, DeleteTicketTypeMutationVariables>) {
        return Apollo.useMutation<DeleteTicketTypeMutation, DeleteTicketTypeMutationVariables>(DeleteTicketTypeDocument, baseOptions);
      }
export type DeleteTicketTypeMutationHookResult = ReturnType<typeof useDeleteTicketTypeMutation>;
export type DeleteTicketTypeMutationResult = Apollo.MutationResult<DeleteTicketTypeMutation>;
export type DeleteTicketTypeMutationOptions = Apollo.BaseMutationOptions<DeleteTicketTypeMutation, DeleteTicketTypeMutationVariables>;