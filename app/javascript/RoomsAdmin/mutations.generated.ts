/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CreateRoomMutationVariables = Types.Exact<{
  input: Types.CreateRoomInput;
}>;


export type CreateRoomMutationData = { __typename: 'Mutation', createRoom: { __typename: 'CreateRoomPayload', room: { __typename: 'Room', name?: string | null | undefined, id: string, runs: Array<{ __typename: 'Run', id: string }> } } };

export type UpdateRoomMutationVariables = Types.Exact<{
  input: Types.UpdateRoomInput;
}>;


export type UpdateRoomMutationData = { __typename: 'Mutation', updateRoom: { __typename: 'UpdateRoomPayload', room: { __typename: 'Room', name?: string | null | undefined, id: string, runs: Array<{ __typename: 'Run', id: string }> } } };

export type DeleteRoomMutationVariables = Types.Exact<{
  input: Types.DeleteRoomInput;
}>;


export type DeleteRoomMutationData = { __typename: 'Mutation', deleteRoom: { __typename: 'DeleteRoomPayload', room: { __typename: 'Room', id: string } } };


export const CreateRoomDocument = gql`
    mutation CreateRoom($input: CreateRoomInput!) {
  createRoom(input: $input) {
    room {
      id: transitionalId
      name
      runs {
        id: transitionalId
      }
    }
  }
}
    `;
export type CreateRoomMutationFn = Apollo.MutationFunction<CreateRoomMutationData, CreateRoomMutationVariables>;

/**
 * __useCreateRoomMutation__
 *
 * To run a mutation, you first call `useCreateRoomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRoomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRoomMutation, { data, loading, error }] = useCreateRoomMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateRoomMutation(baseOptions?: Apollo.MutationHookOptions<CreateRoomMutationData, CreateRoomMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateRoomMutationData, CreateRoomMutationVariables>(CreateRoomDocument, options);
      }
export type CreateRoomMutationHookResult = ReturnType<typeof useCreateRoomMutation>;
export type CreateRoomMutationResult = Apollo.MutationResult<CreateRoomMutationData>;
export type CreateRoomMutationOptions = Apollo.BaseMutationOptions<CreateRoomMutationData, CreateRoomMutationVariables>;
export const UpdateRoomDocument = gql`
    mutation UpdateRoom($input: UpdateRoomInput!) {
  updateRoom(input: $input) {
    room {
      id: transitionalId
      name
      runs {
        id: transitionalId
      }
    }
  }
}
    `;
export type UpdateRoomMutationFn = Apollo.MutationFunction<UpdateRoomMutationData, UpdateRoomMutationVariables>;

/**
 * __useUpdateRoomMutation__
 *
 * To run a mutation, you first call `useUpdateRoomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRoomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRoomMutation, { data, loading, error }] = useUpdateRoomMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateRoomMutation(baseOptions?: Apollo.MutationHookOptions<UpdateRoomMutationData, UpdateRoomMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateRoomMutationData, UpdateRoomMutationVariables>(UpdateRoomDocument, options);
      }
export type UpdateRoomMutationHookResult = ReturnType<typeof useUpdateRoomMutation>;
export type UpdateRoomMutationResult = Apollo.MutationResult<UpdateRoomMutationData>;
export type UpdateRoomMutationOptions = Apollo.BaseMutationOptions<UpdateRoomMutationData, UpdateRoomMutationVariables>;
export const DeleteRoomDocument = gql`
    mutation DeleteRoom($input: DeleteRoomInput!) {
  deleteRoom(input: $input) {
    room {
      id: transitionalId
    }
  }
}
    `;
export type DeleteRoomMutationFn = Apollo.MutationFunction<DeleteRoomMutationData, DeleteRoomMutationVariables>;

/**
 * __useDeleteRoomMutation__
 *
 * To run a mutation, you first call `useDeleteRoomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRoomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteRoomMutation, { data, loading, error }] = useDeleteRoomMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteRoomMutation(baseOptions?: Apollo.MutationHookOptions<DeleteRoomMutationData, DeleteRoomMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteRoomMutationData, DeleteRoomMutationVariables>(DeleteRoomDocument, options);
      }
export type DeleteRoomMutationHookResult = ReturnType<typeof useDeleteRoomMutation>;
export type DeleteRoomMutationResult = Apollo.MutationResult<DeleteRoomMutationData>;
export type DeleteRoomMutationOptions = Apollo.BaseMutationOptions<DeleteRoomMutationData, DeleteRoomMutationVariables>;