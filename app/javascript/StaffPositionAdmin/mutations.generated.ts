/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { StaffPositionFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CreateStaffPositionMutationVariables = Types.Exact<{
  input: Types.CreateStaffPositionInput;
}>;


export type CreateStaffPositionMutationData = { __typename: 'Mutation', createStaffPosition: { __typename: 'CreateStaffPositionPayload', staff_position: { __typename: 'StaffPosition', name: string, email?: string | null | undefined, visible?: boolean | null | undefined, email_aliases: Array<string>, cc_addresses: Array<string>, id: string, user_con_profiles: Array<{ __typename: 'UserConProfile', name_without_nickname: string, gravatar_url: string, gravatar_enabled: boolean, id: string }>, permissions: Array<{ __typename: 'Permission', permission: string, id: string, model: { __typename: 'CmsContentGroup', name: string, id: string } | { __typename: 'Convention', name: string, id: string } | { __typename: 'EventCategory', name: string, default_color?: string | null | undefined, id: string }, role: { __typename: 'OrganizationRole', name: string, id: string } | { __typename: 'StaffPosition', name: string, id: string } }> } } };

export type UpdateStaffPositionMutationVariables = Types.Exact<{
  input: Types.UpdateStaffPositionInput;
}>;


export type UpdateStaffPositionMutationData = { __typename: 'Mutation', updateStaffPosition: { __typename: 'UpdateStaffPositionPayload', staff_position: { __typename: 'StaffPosition', name: string, email?: string | null | undefined, visible?: boolean | null | undefined, email_aliases: Array<string>, cc_addresses: Array<string>, id: string, user_con_profiles: Array<{ __typename: 'UserConProfile', name_without_nickname: string, gravatar_url: string, gravatar_enabled: boolean, id: string }>, permissions: Array<{ __typename: 'Permission', permission: string, id: string, model: { __typename: 'CmsContentGroup', name: string, id: string } | { __typename: 'Convention', name: string, id: string } | { __typename: 'EventCategory', name: string, default_color?: string | null | undefined, id: string }, role: { __typename: 'OrganizationRole', name: string, id: string } | { __typename: 'StaffPosition', name: string, id: string } }> } } };

export type UpdateStaffPositionPermissionsMutationVariables = Types.Exact<{
  staffPositionId: Types.Scalars['ID'];
  grantPermissions: Array<Types.PermissionInput> | Types.PermissionInput;
  revokePermissions: Array<Types.PermissionInput> | Types.PermissionInput;
}>;


export type UpdateStaffPositionPermissionsMutationData = { __typename: 'Mutation', updateStaffPositionPermissions: { __typename: 'UpdateStaffPositionPermissionsPayload', staff_position: { __typename: 'StaffPosition', name: string, email?: string | null | undefined, visible?: boolean | null | undefined, email_aliases: Array<string>, cc_addresses: Array<string>, id: string, user_con_profiles: Array<{ __typename: 'UserConProfile', name_without_nickname: string, gravatar_url: string, gravatar_enabled: boolean, id: string }>, permissions: Array<{ __typename: 'Permission', permission: string, id: string, model: { __typename: 'CmsContentGroup', name: string, id: string } | { __typename: 'Convention', name: string, id: string } | { __typename: 'EventCategory', name: string, default_color?: string | null | undefined, id: string }, role: { __typename: 'OrganizationRole', name: string, id: string } | { __typename: 'StaffPosition', name: string, id: string } }> } } };

export type DeleteStaffPositionMutationVariables = Types.Exact<{
  input: Types.DeleteStaffPositionInput;
}>;


export type DeleteStaffPositionMutationData = { __typename: 'Mutation', deleteStaffPosition: { __typename: 'DeleteStaffPositionPayload', staff_position: { __typename: 'StaffPosition', id: string } } };


export const CreateStaffPositionDocument = gql`
    mutation CreateStaffPosition($input: CreateStaffPositionInput!) {
  createStaffPosition(input: $input) {
    staff_position {
      id: transitionalId
      ...StaffPositionFields
    }
  }
}
    ${StaffPositionFieldsFragmentDoc}`;
export type CreateStaffPositionMutationFn = Apollo.MutationFunction<CreateStaffPositionMutationData, CreateStaffPositionMutationVariables>;

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
export function useCreateStaffPositionMutation(baseOptions?: Apollo.MutationHookOptions<CreateStaffPositionMutationData, CreateStaffPositionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateStaffPositionMutationData, CreateStaffPositionMutationVariables>(CreateStaffPositionDocument, options);
      }
export type CreateStaffPositionMutationHookResult = ReturnType<typeof useCreateStaffPositionMutation>;
export type CreateStaffPositionMutationResult = Apollo.MutationResult<CreateStaffPositionMutationData>;
export type CreateStaffPositionMutationOptions = Apollo.BaseMutationOptions<CreateStaffPositionMutationData, CreateStaffPositionMutationVariables>;
export const UpdateStaffPositionDocument = gql`
    mutation UpdateStaffPosition($input: UpdateStaffPositionInput!) {
  updateStaffPosition(input: $input) {
    staff_position {
      id: transitionalId
      ...StaffPositionFields
    }
  }
}
    ${StaffPositionFieldsFragmentDoc}`;
export type UpdateStaffPositionMutationFn = Apollo.MutationFunction<UpdateStaffPositionMutationData, UpdateStaffPositionMutationVariables>;

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
export function useUpdateStaffPositionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateStaffPositionMutationData, UpdateStaffPositionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateStaffPositionMutationData, UpdateStaffPositionMutationVariables>(UpdateStaffPositionDocument, options);
      }
export type UpdateStaffPositionMutationHookResult = ReturnType<typeof useUpdateStaffPositionMutation>;
export type UpdateStaffPositionMutationResult = Apollo.MutationResult<UpdateStaffPositionMutationData>;
export type UpdateStaffPositionMutationOptions = Apollo.BaseMutationOptions<UpdateStaffPositionMutationData, UpdateStaffPositionMutationVariables>;
export const UpdateStaffPositionPermissionsDocument = gql`
    mutation UpdateStaffPositionPermissions($staffPositionId: ID!, $grantPermissions: [PermissionInput!]!, $revokePermissions: [PermissionInput!]!) {
  updateStaffPositionPermissions(
    input: {transitionalStaffPositionId: $staffPositionId, grant_permissions: $grantPermissions, revoke_permissions: $revokePermissions}
  ) {
    staff_position {
      id: transitionalId
      ...StaffPositionFields
    }
  }
}
    ${StaffPositionFieldsFragmentDoc}`;
export type UpdateStaffPositionPermissionsMutationFn = Apollo.MutationFunction<UpdateStaffPositionPermissionsMutationData, UpdateStaffPositionPermissionsMutationVariables>;

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
export function useUpdateStaffPositionPermissionsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateStaffPositionPermissionsMutationData, UpdateStaffPositionPermissionsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateStaffPositionPermissionsMutationData, UpdateStaffPositionPermissionsMutationVariables>(UpdateStaffPositionPermissionsDocument, options);
      }
export type UpdateStaffPositionPermissionsMutationHookResult = ReturnType<typeof useUpdateStaffPositionPermissionsMutation>;
export type UpdateStaffPositionPermissionsMutationResult = Apollo.MutationResult<UpdateStaffPositionPermissionsMutationData>;
export type UpdateStaffPositionPermissionsMutationOptions = Apollo.BaseMutationOptions<UpdateStaffPositionPermissionsMutationData, UpdateStaffPositionPermissionsMutationVariables>;
export const DeleteStaffPositionDocument = gql`
    mutation DeleteStaffPosition($input: DeleteStaffPositionInput!) {
  deleteStaffPosition(input: $input) {
    staff_position {
      id: transitionalId
    }
  }
}
    `;
export type DeleteStaffPositionMutationFn = Apollo.MutationFunction<DeleteStaffPositionMutationData, DeleteStaffPositionMutationVariables>;

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
export function useDeleteStaffPositionMutation(baseOptions?: Apollo.MutationHookOptions<DeleteStaffPositionMutationData, DeleteStaffPositionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteStaffPositionMutationData, DeleteStaffPositionMutationVariables>(DeleteStaffPositionDocument, options);
      }
export type DeleteStaffPositionMutationHookResult = ReturnType<typeof useDeleteStaffPositionMutation>;
export type DeleteStaffPositionMutationResult = Apollo.MutationResult<DeleteStaffPositionMutationData>;
export type DeleteStaffPositionMutationOptions = Apollo.BaseMutationOptions<DeleteStaffPositionMutationData, DeleteStaffPositionMutationVariables>;