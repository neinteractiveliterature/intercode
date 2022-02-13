/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { CmsPartialFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreatePartialMutationVariables = Types.Exact<{
  cmsPartial: Types.CmsPartialInput;
}>;


export type CreatePartialMutationData = { __typename: 'Mutation', createCmsPartial: { __typename: 'CreateCmsPartialPayload', cms_partial: { __typename: 'CmsPartial', id: string, name?: string | null, content?: string | null, admin_notes?: string | null, current_ability_can_update: boolean, current_ability_can_delete: boolean } } };

export type UpdatePartialMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  cmsPartial: Types.CmsPartialInput;
}>;


export type UpdatePartialMutationData = { __typename: 'Mutation', updateCmsPartial: { __typename: 'UpdateCmsPartialPayload', cms_partial: { __typename: 'CmsPartial', id: string, name?: string | null, content?: string | null, admin_notes?: string | null, current_ability_can_update: boolean, current_ability_can_delete: boolean } } };

export type DeletePartialMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type DeletePartialMutationData = { __typename: 'Mutation', deleteCmsPartial: { __typename: 'DeleteCmsPartialPayload', clientMutationId?: string | null } };


export const CreatePartialDocument = gql`
    mutation CreatePartial($cmsPartial: CmsPartialInput!) {
  createCmsPartial(input: {cms_partial: $cmsPartial}) {
    cms_partial {
      id
      ...CmsPartialFields
    }
  }
}
    ${CmsPartialFieldsFragmentDoc}`;
export type CreatePartialMutationFn = Apollo.MutationFunction<CreatePartialMutationData, CreatePartialMutationVariables>;

/**
 * __useCreatePartialMutation__
 *
 * To run a mutation, you first call `useCreatePartialMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePartialMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPartialMutation, { data, loading, error }] = useCreatePartialMutation({
 *   variables: {
 *      cmsPartial: // value for 'cmsPartial'
 *   },
 * });
 */
export function useCreatePartialMutation(baseOptions?: Apollo.MutationHookOptions<CreatePartialMutationData, CreatePartialMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePartialMutationData, CreatePartialMutationVariables>(CreatePartialDocument, options);
      }
export type CreatePartialMutationHookResult = ReturnType<typeof useCreatePartialMutation>;
export type CreatePartialMutationResult = Apollo.MutationResult<CreatePartialMutationData>;
export type CreatePartialMutationOptions = Apollo.BaseMutationOptions<CreatePartialMutationData, CreatePartialMutationVariables>;
export const UpdatePartialDocument = gql`
    mutation UpdatePartial($id: ID!, $cmsPartial: CmsPartialInput!) {
  updateCmsPartial(input: {id: $id, cms_partial: $cmsPartial}) {
    cms_partial {
      id
      ...CmsPartialFields
    }
  }
}
    ${CmsPartialFieldsFragmentDoc}`;
export type UpdatePartialMutationFn = Apollo.MutationFunction<UpdatePartialMutationData, UpdatePartialMutationVariables>;

/**
 * __useUpdatePartialMutation__
 *
 * To run a mutation, you first call `useUpdatePartialMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePartialMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePartialMutation, { data, loading, error }] = useUpdatePartialMutation({
 *   variables: {
 *      id: // value for 'id'
 *      cmsPartial: // value for 'cmsPartial'
 *   },
 * });
 */
export function useUpdatePartialMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePartialMutationData, UpdatePartialMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePartialMutationData, UpdatePartialMutationVariables>(UpdatePartialDocument, options);
      }
export type UpdatePartialMutationHookResult = ReturnType<typeof useUpdatePartialMutation>;
export type UpdatePartialMutationResult = Apollo.MutationResult<UpdatePartialMutationData>;
export type UpdatePartialMutationOptions = Apollo.BaseMutationOptions<UpdatePartialMutationData, UpdatePartialMutationVariables>;
export const DeletePartialDocument = gql`
    mutation DeletePartial($id: ID!) {
  deleteCmsPartial(input: {id: $id}) {
    clientMutationId
  }
}
    `;
export type DeletePartialMutationFn = Apollo.MutationFunction<DeletePartialMutationData, DeletePartialMutationVariables>;

/**
 * __useDeletePartialMutation__
 *
 * To run a mutation, you first call `useDeletePartialMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePartialMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePartialMutation, { data, loading, error }] = useDeletePartialMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeletePartialMutation(baseOptions?: Apollo.MutationHookOptions<DeletePartialMutationData, DeletePartialMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeletePartialMutationData, DeletePartialMutationVariables>(DeletePartialDocument, options);
      }
export type DeletePartialMutationHookResult = ReturnType<typeof useDeletePartialMutation>;
export type DeletePartialMutationResult = Apollo.MutationResult<DeletePartialMutationData>;
export type DeletePartialMutationOptions = Apollo.BaseMutationOptions<DeletePartialMutationData, DeletePartialMutationVariables>;