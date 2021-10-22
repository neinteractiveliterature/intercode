/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { CmsLayoutFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CreateLayoutMutationVariables = Types.Exact<{
  cmsLayout: Types.CmsLayoutInput;
}>;


export type CreateLayoutMutationData = { __typename: 'Mutation', createCmsLayout: { __typename: 'CreateCmsLayoutPayload', cms_layout: { __typename: 'CmsLayout', id: string, name?: string | null | undefined, content?: string | null | undefined, navbar_classes?: string | null | undefined, admin_notes?: string | null | undefined, current_ability_can_update: boolean, current_ability_can_delete: boolean } } };

export type UpdateLayoutMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  cmsLayout: Types.CmsLayoutInput;
}>;


export type UpdateLayoutMutationData = { __typename: 'Mutation', updateCmsLayout: { __typename: 'UpdateCmsLayoutPayload', cms_layout: { __typename: 'CmsLayout', id: string, name?: string | null | undefined, content?: string | null | undefined, navbar_classes?: string | null | undefined, admin_notes?: string | null | undefined, current_ability_can_update: boolean, current_ability_can_delete: boolean } } };

export type DeleteLayoutMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type DeleteLayoutMutationData = { __typename: 'Mutation', deleteCmsLayout: { __typename: 'DeleteCmsLayoutPayload', clientMutationId?: string | null | undefined } };


export const CreateLayoutDocument = gql`
    mutation CreateLayout($cmsLayout: CmsLayoutInput!) {
  createCmsLayout(input: {cms_layout: $cmsLayout}) {
    cms_layout {
      id
      ...CmsLayoutFields
    }
  }
}
    ${CmsLayoutFieldsFragmentDoc}`;
export type CreateLayoutMutationFn = Apollo.MutationFunction<CreateLayoutMutationData, CreateLayoutMutationVariables>;

/**
 * __useCreateLayoutMutation__
 *
 * To run a mutation, you first call `useCreateLayoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLayoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLayoutMutation, { data, loading, error }] = useCreateLayoutMutation({
 *   variables: {
 *      cmsLayout: // value for 'cmsLayout'
 *   },
 * });
 */
export function useCreateLayoutMutation(baseOptions?: Apollo.MutationHookOptions<CreateLayoutMutationData, CreateLayoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateLayoutMutationData, CreateLayoutMutationVariables>(CreateLayoutDocument, options);
      }
export type CreateLayoutMutationHookResult = ReturnType<typeof useCreateLayoutMutation>;
export type CreateLayoutMutationResult = Apollo.MutationResult<CreateLayoutMutationData>;
export type CreateLayoutMutationOptions = Apollo.BaseMutationOptions<CreateLayoutMutationData, CreateLayoutMutationVariables>;
export const UpdateLayoutDocument = gql`
    mutation UpdateLayout($id: ID!, $cmsLayout: CmsLayoutInput!) {
  updateCmsLayout(input: {transitionalId: $id, cms_layout: $cmsLayout}) {
    cms_layout {
      id
      ...CmsLayoutFields
    }
  }
}
    ${CmsLayoutFieldsFragmentDoc}`;
export type UpdateLayoutMutationFn = Apollo.MutationFunction<UpdateLayoutMutationData, UpdateLayoutMutationVariables>;

/**
 * __useUpdateLayoutMutation__
 *
 * To run a mutation, you first call `useUpdateLayoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLayoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLayoutMutation, { data, loading, error }] = useUpdateLayoutMutation({
 *   variables: {
 *      id: // value for 'id'
 *      cmsLayout: // value for 'cmsLayout'
 *   },
 * });
 */
export function useUpdateLayoutMutation(baseOptions?: Apollo.MutationHookOptions<UpdateLayoutMutationData, UpdateLayoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateLayoutMutationData, UpdateLayoutMutationVariables>(UpdateLayoutDocument, options);
      }
export type UpdateLayoutMutationHookResult = ReturnType<typeof useUpdateLayoutMutation>;
export type UpdateLayoutMutationResult = Apollo.MutationResult<UpdateLayoutMutationData>;
export type UpdateLayoutMutationOptions = Apollo.BaseMutationOptions<UpdateLayoutMutationData, UpdateLayoutMutationVariables>;
export const DeleteLayoutDocument = gql`
    mutation DeleteLayout($id: ID!) {
  deleteCmsLayout(input: {transitionalId: $id}) {
    clientMutationId
  }
}
    `;
export type DeleteLayoutMutationFn = Apollo.MutationFunction<DeleteLayoutMutationData, DeleteLayoutMutationVariables>;

/**
 * __useDeleteLayoutMutation__
 *
 * To run a mutation, you first call `useDeleteLayoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteLayoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteLayoutMutation, { data, loading, error }] = useDeleteLayoutMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteLayoutMutation(baseOptions?: Apollo.MutationHookOptions<DeleteLayoutMutationData, DeleteLayoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteLayoutMutationData, DeleteLayoutMutationVariables>(DeleteLayoutDocument, options);
      }
export type DeleteLayoutMutationHookResult = ReturnType<typeof useDeleteLayoutMutation>;
export type DeleteLayoutMutationResult = Apollo.MutationResult<DeleteLayoutMutationData>;
export type DeleteLayoutMutationOptions = Apollo.BaseMutationOptions<DeleteLayoutMutationData, DeleteLayoutMutationVariables>;