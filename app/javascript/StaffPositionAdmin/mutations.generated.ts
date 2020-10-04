/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { StaffPositionFieldsFragment } from './queries.generated';
import { gql } from '@apollo/client';
import { StaffPositionFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
export type CreateStaffPositionMutationVariables = Types.Exact<{
  input: Types.CreateStaffPositionInput;
}>;


export type CreateStaffPositionMutation = (
  { __typename: 'Mutation' }
  & { createStaffPosition?: Types.Maybe<(
    { __typename: 'CreateStaffPositionPayload' }
    & { staff_position: (
      { __typename: 'StaffPosition' }
      & Pick<Types.StaffPosition, 'id'>
      & StaffPositionFieldsFragment
    ) }
  )> }
);

export type UpdateStaffPositionMutationVariables = Types.Exact<{
  input: Types.UpdateStaffPositionInput;
}>;


export type UpdateStaffPositionMutation = (
  { __typename: 'Mutation' }
  & { updateStaffPosition?: Types.Maybe<(
    { __typename: 'UpdateStaffPositionPayload' }
    & { staff_position: (
      { __typename: 'StaffPosition' }
      & Pick<Types.StaffPosition, 'id'>
      & StaffPositionFieldsFragment
    ) }
  )> }
);

export type UpdateStaffPositionPermissionsMutationVariables = Types.Exact<{
  staffPositionId: Types.Scalars['Int'];
  grantPermissions: Array<Types.PermissionInput>;
  revokePermissions: Array<Types.PermissionInput>;
}>;


export type UpdateStaffPositionPermissionsMutation = (
  { __typename: 'Mutation' }
  & { updateStaffPositionPermissions?: Types.Maybe<(
    { __typename: 'UpdateStaffPositionPermissionsPayload' }
    & { staff_position: (
      { __typename: 'StaffPosition' }
      & Pick<Types.StaffPosition, 'id'>
      & StaffPositionFieldsFragment
    ) }
  )> }
);

export type DeleteStaffPositionMutationVariables = Types.Exact<{
  input: Types.DeleteStaffPositionInput;
}>;


export type DeleteStaffPositionMutation = (
  { __typename: 'Mutation' }
  & { deleteStaffPosition?: Types.Maybe<(
    { __typename: 'DeleteStaffPositionPayload' }
    & { staff_position: (
      { __typename: 'StaffPosition' }
      & Pick<Types.StaffPosition, 'id'>
    ) }
  )> }
);


export const CreateStaffPositionDocument = gql`
    mutation CreateStaffPosition($input: CreateStaffPositionInput!) {
  createStaffPosition(input: $input) {
    staff_position {
      id
      ...StaffPositionFields
    }
  }
}
    ${StaffPositionFieldsFragmentDoc}`;
export type CreateStaffPositionMutationFn = Apollo.MutationFunction<CreateStaffPositionMutation, CreateStaffPositionMutationVariables>;

/**
 * __useCreateStaffPositionMutation__
 *
 * To run a mutation, you first call `useCreateStaffPositionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateStaffPositionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createStaffPositionMutation, { data, loading, error }] = useCreateStaffPositionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateStaffPositionMutation(baseOptions?: Apollo.MutationHookOptions<CreateStaffPositionMutation, CreateStaffPositionMutationVariables>) {
        return Apollo.useMutation<CreateStaffPositionMutation, CreateStaffPositionMutationVariables>(CreateStaffPositionDocument, baseOptions);
      }
export type CreateStaffPositionMutationHookResult = ReturnType<typeof useCreateStaffPositionMutation>;
export type CreateStaffPositionMutationResult = Apollo.MutationResult<CreateStaffPositionMutation>;
export type CreateStaffPositionMutationOptions = Apollo.BaseMutationOptions<CreateStaffPositionMutation, CreateStaffPositionMutationVariables>;
export const UpdateStaffPositionDocument = gql`
    mutation UpdateStaffPosition($input: UpdateStaffPositionInput!) {
  updateStaffPosition(input: $input) {
    staff_position {
      id
      ...StaffPositionFields
    }
  }
}
    ${StaffPositionFieldsFragmentDoc}`;
export type UpdateStaffPositionMutationFn = Apollo.MutationFunction<UpdateStaffPositionMutation, UpdateStaffPositionMutationVariables>;

/**
 * __useUpdateStaffPositionMutation__
 *
 * To run a mutation, you first call `useUpdateStaffPositionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateStaffPositionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateStaffPositionMutation, { data, loading, error }] = useUpdateStaffPositionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateStaffPositionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateStaffPositionMutation, UpdateStaffPositionMutationVariables>) {
        return Apollo.useMutation<UpdateStaffPositionMutation, UpdateStaffPositionMutationVariables>(UpdateStaffPositionDocument, baseOptions);
      }
export type UpdateStaffPositionMutationHookResult = ReturnType<typeof useUpdateStaffPositionMutation>;
export type UpdateStaffPositionMutationResult = Apollo.MutationResult<UpdateStaffPositionMutation>;
export type UpdateStaffPositionMutationOptions = Apollo.BaseMutationOptions<UpdateStaffPositionMutation, UpdateStaffPositionMutationVariables>;
export const UpdateStaffPositionPermissionsDocument = gql`
    mutation UpdateStaffPositionPermissions($staffPositionId: Int!, $grantPermissions: [PermissionInput!]!, $revokePermissions: [PermissionInput!]!) {
  updateStaffPositionPermissions(input: {staff_position_id: $staffPositionId, grant_permissions: $grantPermissions, revoke_permissions: $revokePermissions}) {
    staff_position {
      id
      ...StaffPositionFields
    }
  }
}
    ${StaffPositionFieldsFragmentDoc}`;
export type UpdateStaffPositionPermissionsMutationFn = Apollo.MutationFunction<UpdateStaffPositionPermissionsMutation, UpdateStaffPositionPermissionsMutationVariables>;

/**
 * __useUpdateStaffPositionPermissionsMutation__
 *
 * To run a mutation, you first call `useUpdateStaffPositionPermissionsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateStaffPositionPermissionsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateStaffPositionPermissionsMutation, { data, loading, error }] = useUpdateStaffPositionPermissionsMutation({
 *   variables: {
 *      staffPositionId: // value for 'staffPositionId'
 *      grantPermissions: // value for 'grantPermissions'
 *      revokePermissions: // value for 'revokePermissions'
 *   },
 * });
 */
export function useUpdateStaffPositionPermissionsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateStaffPositionPermissionsMutation, UpdateStaffPositionPermissionsMutationVariables>) {
        return Apollo.useMutation<UpdateStaffPositionPermissionsMutation, UpdateStaffPositionPermissionsMutationVariables>(UpdateStaffPositionPermissionsDocument, baseOptions);
      }
export type UpdateStaffPositionPermissionsMutationHookResult = ReturnType<typeof useUpdateStaffPositionPermissionsMutation>;
export type UpdateStaffPositionPermissionsMutationResult = Apollo.MutationResult<UpdateStaffPositionPermissionsMutation>;
export type UpdateStaffPositionPermissionsMutationOptions = Apollo.BaseMutationOptions<UpdateStaffPositionPermissionsMutation, UpdateStaffPositionPermissionsMutationVariables>;
export const DeleteStaffPositionDocument = gql`
    mutation DeleteStaffPosition($input: DeleteStaffPositionInput!) {
  deleteStaffPosition(input: $input) {
    staff_position {
      id
    }
  }
}
    `;
export type DeleteStaffPositionMutationFn = Apollo.MutationFunction<DeleteStaffPositionMutation, DeleteStaffPositionMutationVariables>;

/**
 * __useDeleteStaffPositionMutation__
 *
 * To run a mutation, you first call `useDeleteStaffPositionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteStaffPositionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteStaffPositionMutation, { data, loading, error }] = useDeleteStaffPositionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteStaffPositionMutation(baseOptions?: Apollo.MutationHookOptions<DeleteStaffPositionMutation, DeleteStaffPositionMutationVariables>) {
        return Apollo.useMutation<DeleteStaffPositionMutation, DeleteStaffPositionMutationVariables>(DeleteStaffPositionDocument, baseOptions);
      }
export type DeleteStaffPositionMutationHookResult = ReturnType<typeof useDeleteStaffPositionMutation>;
export type DeleteStaffPositionMutationResult = Apollo.MutationResult<DeleteStaffPositionMutation>;
export type DeleteStaffPositionMutationOptions = Apollo.BaseMutationOptions<DeleteStaffPositionMutation, DeleteStaffPositionMutationVariables>;