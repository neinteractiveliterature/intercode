/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { OrganizationRoleFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateOrganizationRoleMutationVariables = Types.Exact<{
  organizationId: Types.Scalars['ID'];
  name: Types.Scalars['String'];
  userIds: Array<Types.Scalars['ID']> | Types.Scalars['ID'];
  permissions: Array<Types.PermissionInput> | Types.PermissionInput;
}>;


export type CreateOrganizationRoleMutationData = { __typename: 'Mutation', createOrganizationRole: { __typename: 'CreateOrganizationRolePayload', organization_role: { __typename: 'OrganizationRole', id: string, name: string, users: Array<{ __typename: 'User', id: string, name?: string | null | undefined, email?: string | null | undefined }>, permissions: Array<{ __typename: 'Permission', id: string, permission: string }> } } };

export type UpdateOrganizationRoleMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  name?: Types.InputMaybe<Types.Scalars['String']>;
  addUserIds?: Types.InputMaybe<Array<Types.Scalars['ID']> | Types.Scalars['ID']>;
  removeUserIds?: Types.InputMaybe<Array<Types.Scalars['ID']> | Types.Scalars['ID']>;
  addPermissions?: Types.InputMaybe<Array<Types.PermissionInput> | Types.PermissionInput>;
  removePermissionIds?: Types.InputMaybe<Array<Types.Scalars['ID']> | Types.Scalars['ID']>;
}>;


export type UpdateOrganizationRoleMutationData = { __typename: 'Mutation', updateOrganizationRole: { __typename: 'UpdateOrganizationRolePayload', organization_role: { __typename: 'OrganizationRole', id: string, name: string, users: Array<{ __typename: 'User', id: string, name?: string | null | undefined, email?: string | null | undefined }>, permissions: Array<{ __typename: 'Permission', id: string, permission: string }> } } };

export type DeleteOrganizationRoleMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type DeleteOrganizationRoleMutationData = { __typename: 'Mutation', deleteOrganizationRole: { __typename: 'DeleteOrganizationRolePayload', clientMutationId?: string | null | undefined } };


export const CreateOrganizationRoleDocument = gql`
    mutation CreateOrganizationRole($organizationId: ID!, $name: String!, $userIds: [ID!]!, $permissions: [PermissionInput!]!) {
  createOrganizationRole(
    input: {organizationId: $organizationId, organization_role: {name: $name}, userIds: $userIds, permissions: $permissions}
  ) {
    organization_role {
      id
      ...OrganizationRoleFields
    }
  }
}
    ${OrganizationRoleFieldsFragmentDoc}`;
export type CreateOrganizationRoleMutationFn = Apollo.MutationFunction<CreateOrganizationRoleMutationData, CreateOrganizationRoleMutationVariables>;

/**
 * __useCreateOrganizationRoleMutation__
 *
 * To run a mutation, you first call `useCreateOrganizationRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOrganizationRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOrganizationRoleMutation, { data, loading, error }] = useCreateOrganizationRoleMutation({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      name: // value for 'name'
 *      userIds: // value for 'userIds'
 *      permissions: // value for 'permissions'
 *   },
 * });
 */
export function useCreateOrganizationRoleMutation(baseOptions?: Apollo.MutationHookOptions<CreateOrganizationRoleMutationData, CreateOrganizationRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateOrganizationRoleMutationData, CreateOrganizationRoleMutationVariables>(CreateOrganizationRoleDocument, options);
      }
export type CreateOrganizationRoleMutationHookResult = ReturnType<typeof useCreateOrganizationRoleMutation>;
export type CreateOrganizationRoleMutationResult = Apollo.MutationResult<CreateOrganizationRoleMutationData>;
export type CreateOrganizationRoleMutationOptions = Apollo.BaseMutationOptions<CreateOrganizationRoleMutationData, CreateOrganizationRoleMutationVariables>;
export const UpdateOrganizationRoleDocument = gql`
    mutation UpdateOrganizationRole($id: ID!, $name: String, $addUserIds: [ID!], $removeUserIds: [ID!], $addPermissions: [PermissionInput!], $removePermissionIds: [ID!]) {
  updateOrganizationRole(
    input: {id: $id, organization_role: {name: $name}, addUserIds: $addUserIds, removeUserIds: $removeUserIds, add_permissions: $addPermissions, removePermissionIds: $removePermissionIds}
  ) {
    organization_role {
      id
      ...OrganizationRoleFields
    }
  }
}
    ${OrganizationRoleFieldsFragmentDoc}`;
export type UpdateOrganizationRoleMutationFn = Apollo.MutationFunction<UpdateOrganizationRoleMutationData, UpdateOrganizationRoleMutationVariables>;

/**
 * __useUpdateOrganizationRoleMutation__
 *
 * To run a mutation, you first call `useUpdateOrganizationRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateOrganizationRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateOrganizationRoleMutation, { data, loading, error }] = useUpdateOrganizationRoleMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      addUserIds: // value for 'addUserIds'
 *      removeUserIds: // value for 'removeUserIds'
 *      addPermissions: // value for 'addPermissions'
 *      removePermissionIds: // value for 'removePermissionIds'
 *   },
 * });
 */
export function useUpdateOrganizationRoleMutation(baseOptions?: Apollo.MutationHookOptions<UpdateOrganizationRoleMutationData, UpdateOrganizationRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateOrganizationRoleMutationData, UpdateOrganizationRoleMutationVariables>(UpdateOrganizationRoleDocument, options);
      }
export type UpdateOrganizationRoleMutationHookResult = ReturnType<typeof useUpdateOrganizationRoleMutation>;
export type UpdateOrganizationRoleMutationResult = Apollo.MutationResult<UpdateOrganizationRoleMutationData>;
export type UpdateOrganizationRoleMutationOptions = Apollo.BaseMutationOptions<UpdateOrganizationRoleMutationData, UpdateOrganizationRoleMutationVariables>;
export const DeleteOrganizationRoleDocument = gql`
    mutation DeleteOrganizationRole($id: ID!) {
  deleteOrganizationRole(input: {id: $id}) {
    clientMutationId
  }
}
    `;
export type DeleteOrganizationRoleMutationFn = Apollo.MutationFunction<DeleteOrganizationRoleMutationData, DeleteOrganizationRoleMutationVariables>;

/**
 * __useDeleteOrganizationRoleMutation__
 *
 * To run a mutation, you first call `useDeleteOrganizationRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteOrganizationRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteOrganizationRoleMutation, { data, loading, error }] = useDeleteOrganizationRoleMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteOrganizationRoleMutation(baseOptions?: Apollo.MutationHookOptions<DeleteOrganizationRoleMutationData, DeleteOrganizationRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteOrganizationRoleMutationData, DeleteOrganizationRoleMutationVariables>(DeleteOrganizationRoleDocument, options);
      }
export type DeleteOrganizationRoleMutationHookResult = ReturnType<typeof useDeleteOrganizationRoleMutation>;
export type DeleteOrganizationRoleMutationResult = Apollo.MutationResult<DeleteOrganizationRoleMutationData>;
export type DeleteOrganizationRoleMutationOptions = Apollo.BaseMutationOptions<DeleteOrganizationRoleMutationData, DeleteOrganizationRoleMutationVariables>;