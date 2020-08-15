/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';


export type CreateRoomMutationVariables = Types.Exact<{
  input: Types.CreateRoomInput;
}>;


export type CreateRoomMutation = (
  { __typename?: 'Mutation' }
  & { createRoom?: Types.Maybe<(
    { __typename?: 'CreateRoomPayload' }
    & { room: (
      { __typename?: 'Room' }
      & Pick<Types.Room, 'id' | 'name'>
      & { runs: Array<(
        { __typename?: 'Run' }
        & Pick<Types.Run, 'id'>
      )> }
    ) }
  )> }
);

export type UpdateRoomMutationVariables = Types.Exact<{
  input: Types.UpdateRoomInput;
}>;


export type UpdateRoomMutation = (
  { __typename?: 'Mutation' }
  & { updateRoom?: Types.Maybe<(
    { __typename?: 'UpdateRoomPayload' }
    & { room: (
      { __typename?: 'Room' }
      & Pick<Types.Room, 'id' | 'name'>
      & { runs: Array<(
        { __typename?: 'Run' }
        & Pick<Types.Run, 'id'>
      )> }
    ) }
  )> }
);

export type DeleteRoomMutationVariables = Types.Exact<{
  input: Types.DeleteRoomInput;
}>;


export type DeleteRoomMutation = (
  { __typename?: 'Mutation' }
  & { deleteRoom?: Types.Maybe<(
    { __typename?: 'DeleteRoomPayload' }
    & { room: (
      { __typename?: 'Room' }
      & Pick<Types.Room, 'id'>
    ) }
  )> }
);


export const CreateRoomDocument = gql`
    mutation CreateRoom($input: CreateRoomInput!) {
  createRoom(input: $input) {
    room {
      id
      name
      runs {
        id
      }
    }
  }
}
    `;
export type CreateRoomMutationFn = Apollo.MutationFunction<CreateRoomMutation, CreateRoomMutationVariables>;

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
export function useCreateRoomMutation(baseOptions?: Apollo.MutationHookOptions<CreateRoomMutation, CreateRoomMutationVariables>) {
        return Apollo.useMutation<CreateRoomMutation, CreateRoomMutationVariables>(CreateRoomDocument, baseOptions);
      }
export type CreateRoomMutationHookResult = ReturnType<typeof useCreateRoomMutation>;
export type CreateRoomMutationResult = Apollo.MutationResult<CreateRoomMutation>;
export type CreateRoomMutationOptions = Apollo.BaseMutationOptions<CreateRoomMutation, CreateRoomMutationVariables>;
export const UpdateRoomDocument = gql`
    mutation UpdateRoom($input: UpdateRoomInput!) {
  updateRoom(input: $input) {
    room {
      id
      name
      runs {
        id
      }
    }
  }
}
    `;
export type UpdateRoomMutationFn = Apollo.MutationFunction<UpdateRoomMutation, UpdateRoomMutationVariables>;

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
export function useUpdateRoomMutation(baseOptions?: Apollo.MutationHookOptions<UpdateRoomMutation, UpdateRoomMutationVariables>) {
        return Apollo.useMutation<UpdateRoomMutation, UpdateRoomMutationVariables>(UpdateRoomDocument, baseOptions);
      }
export type UpdateRoomMutationHookResult = ReturnType<typeof useUpdateRoomMutation>;
export type UpdateRoomMutationResult = Apollo.MutationResult<UpdateRoomMutation>;
export type UpdateRoomMutationOptions = Apollo.BaseMutationOptions<UpdateRoomMutation, UpdateRoomMutationVariables>;
export const DeleteRoomDocument = gql`
    mutation DeleteRoom($input: DeleteRoomInput!) {
  deleteRoom(input: $input) {
    room {
      id
    }
  }
}
    `;
export type DeleteRoomMutationFn = Apollo.MutationFunction<DeleteRoomMutation, DeleteRoomMutationVariables>;

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
export function useDeleteRoomMutation(baseOptions?: Apollo.MutationHookOptions<DeleteRoomMutation, DeleteRoomMutationVariables>) {
        return Apollo.useMutation<DeleteRoomMutation, DeleteRoomMutationVariables>(DeleteRoomDocument, baseOptions);
      }
export type DeleteRoomMutationHookResult = ReturnType<typeof useDeleteRoomMutation>;
export type DeleteRoomMutationResult = Apollo.MutationResult<DeleteRoomMutation>;
export type DeleteRoomMutationOptions = Apollo.BaseMutationOptions<DeleteRoomMutation, DeleteRoomMutationVariables>;