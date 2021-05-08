/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { CmsContentGroupFieldsFragment } from './queries.generated';
import { gql } from '@apollo/client';
import { CmsContentGroupFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CreateContentGroupMutationVariables = Types.Exact<{
  cmsContentGroup: Types.CmsContentGroupInput;
  permissions?: Types.Maybe<Array<Types.PermissionInput> | Types.PermissionInput>;
}>;


export type CreateContentGroupMutationData = (
  { __typename: 'Mutation' }
  & { createCmsContentGroup?: Types.Maybe<(
    { __typename: 'CreateCmsContentGroupPayload' }
    & { cms_content_group: (
      { __typename: 'CmsContentGroup' }
      & Pick<Types.CmsContentGroup, 'id'>
      & CmsContentGroupFieldsFragment
    ) }
  )> }
);

export type UpdateContentGroupMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
  cmsContentGroup: Types.CmsContentGroupInput;
  grantPermissions?: Types.Maybe<Array<Types.PermissionInput> | Types.PermissionInput>;
  revokePermissions?: Types.Maybe<Array<Types.PermissionInput> | Types.PermissionInput>;
}>;


export type UpdateContentGroupMutationData = (
  { __typename: 'Mutation' }
  & { updateCmsContentGroup?: Types.Maybe<(
    { __typename: 'UpdateCmsContentGroupPayload' }
    & { cms_content_group: (
      { __typename: 'CmsContentGroup' }
      & Pick<Types.CmsContentGroup, 'id'>
      & CmsContentGroupFieldsFragment
    ) }
  )> }
);

export type DeleteContentGroupMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type DeleteContentGroupMutationData = (
  { __typename: 'Mutation' }
  & { deleteCmsContentGroup?: Types.Maybe<(
    { __typename: 'DeleteCmsContentGroupPayload' }
    & Pick<Types.DeleteCmsContentGroupPayload, 'clientMutationId'>
  )> }
);


export const CreateContentGroupDocument = gql`
    mutation CreateContentGroup($cmsContentGroup: CmsContentGroupInput!, $permissions: [PermissionInput!]) {
  createCmsContentGroup(
    input: {cms_content_group: $cmsContentGroup, permissions: $permissions}
  ) {
    cms_content_group {
      id
      ...CmsContentGroupFields
    }
  }
}
    ${CmsContentGroupFieldsFragmentDoc}`;
export type CreateContentGroupMutationFn = Apollo.MutationFunction<CreateContentGroupMutationData, CreateContentGroupMutationVariables>;

/**
 * __useCreateContentGroupMutation__
 *
 * To run a mutation, you first call `useCreateContentGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateContentGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createContentGroupMutation, { data, loading, error }] = useCreateContentGroupMutation({
 *   variables: {
 *      cmsContentGroup: // value for 'cmsContentGroup'
 *      permissions: // value for 'permissions'
 *   },
 * });
 */
export function useCreateContentGroupMutation(baseOptions?: Apollo.MutationHookOptions<CreateContentGroupMutationData, CreateContentGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateContentGroupMutationData, CreateContentGroupMutationVariables>(CreateContentGroupDocument, options);
      }
export type CreateContentGroupMutationHookResult = ReturnType<typeof useCreateContentGroupMutation>;
export type CreateContentGroupMutationResult = Apollo.MutationResult<CreateContentGroupMutationData>;
export type CreateContentGroupMutationOptions = Apollo.BaseMutationOptions<CreateContentGroupMutationData, CreateContentGroupMutationVariables>;
export const UpdateContentGroupDocument = gql`
    mutation UpdateContentGroup($id: Int!, $cmsContentGroup: CmsContentGroupInput!, $grantPermissions: [PermissionInput!], $revokePermissions: [PermissionInput!]) {
  updateCmsContentGroup(
    input: {id: $id, cms_content_group: $cmsContentGroup, grant_permissions: $grantPermissions, revoke_permissions: $revokePermissions}
  ) {
    cms_content_group {
      id
      ...CmsContentGroupFields
    }
  }
}
    ${CmsContentGroupFieldsFragmentDoc}`;
export type UpdateContentGroupMutationFn = Apollo.MutationFunction<UpdateContentGroupMutationData, UpdateContentGroupMutationVariables>;

/**
 * __useUpdateContentGroupMutation__
 *
 * To run a mutation, you first call `useUpdateContentGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateContentGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateContentGroupMutation, { data, loading, error }] = useUpdateContentGroupMutation({
 *   variables: {
 *      id: // value for 'id'
 *      cmsContentGroup: // value for 'cmsContentGroup'
 *      grantPermissions: // value for 'grantPermissions'
 *      revokePermissions: // value for 'revokePermissions'
 *   },
 * });
 */
export function useUpdateContentGroupMutation(baseOptions?: Apollo.MutationHookOptions<UpdateContentGroupMutationData, UpdateContentGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateContentGroupMutationData, UpdateContentGroupMutationVariables>(UpdateContentGroupDocument, options);
      }
export type UpdateContentGroupMutationHookResult = ReturnType<typeof useUpdateContentGroupMutation>;
export type UpdateContentGroupMutationResult = Apollo.MutationResult<UpdateContentGroupMutationData>;
export type UpdateContentGroupMutationOptions = Apollo.BaseMutationOptions<UpdateContentGroupMutationData, UpdateContentGroupMutationVariables>;
export const DeleteContentGroupDocument = gql`
    mutation DeleteContentGroup($id: Int!) {
  deleteCmsContentGroup(input: {id: $id}) {
    clientMutationId
  }
}
    `;
export type DeleteContentGroupMutationFn = Apollo.MutationFunction<DeleteContentGroupMutationData, DeleteContentGroupMutationVariables>;

/**
 * __useDeleteContentGroupMutation__
 *
 * To run a mutation, you first call `useDeleteContentGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteContentGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteContentGroupMutation, { data, loading, error }] = useDeleteContentGroupMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteContentGroupMutation(baseOptions?: Apollo.MutationHookOptions<DeleteContentGroupMutationData, DeleteContentGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteContentGroupMutationData, DeleteContentGroupMutationVariables>(DeleteContentGroupDocument, options);
      }
export type DeleteContentGroupMutationHookResult = ReturnType<typeof useDeleteContentGroupMutation>;
export type DeleteContentGroupMutationResult = Apollo.MutationResult<DeleteContentGroupMutationData>;
export type DeleteContentGroupMutationOptions = Apollo.BaseMutationOptions<DeleteContentGroupMutationData, DeleteContentGroupMutationVariables>;