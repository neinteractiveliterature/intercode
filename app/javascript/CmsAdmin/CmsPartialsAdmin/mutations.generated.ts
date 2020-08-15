/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { CmsPartialFieldsFragment } from './queries.generated';
import { gql } from '@apollo/client';
import { CmsPartialFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';


export type CreatePartialMutationVariables = Types.Exact<{
  cmsPartial: Types.CmsPartialInput;
}>;


export type CreatePartialMutation = (
  { __typename?: 'Mutation' }
  & { createCmsPartial?: Types.Maybe<(
    { __typename?: 'CreateCmsPartialPayload' }
    & { cms_partial: (
      { __typename?: 'CmsPartial' }
      & Pick<Types.CmsPartial, 'id'>
      & CmsPartialFieldsFragment
    ) }
  )> }
);

export type UpdatePartialMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
  cmsPartial: Types.CmsPartialInput;
}>;


export type UpdatePartialMutation = (
  { __typename?: 'Mutation' }
  & { updateCmsPartial?: Types.Maybe<(
    { __typename?: 'UpdateCmsPartialPayload' }
    & { cms_partial: (
      { __typename?: 'CmsPartial' }
      & Pick<Types.CmsPartial, 'id'>
      & CmsPartialFieldsFragment
    ) }
  )> }
);

export type DeletePartialMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type DeletePartialMutation = (
  { __typename?: 'Mutation' }
  & { deleteCmsPartial?: Types.Maybe<(
    { __typename?: 'DeleteCmsPartialPayload' }
    & Pick<Types.DeleteCmsPartialPayload, 'clientMutationId'>
  )> }
);


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
export type CreatePartialMutationFn = Apollo.MutationFunction<CreatePartialMutation, CreatePartialMutationVariables>;

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
export function useCreatePartialMutation(baseOptions?: Apollo.MutationHookOptions<CreatePartialMutation, CreatePartialMutationVariables>) {
        return Apollo.useMutation<CreatePartialMutation, CreatePartialMutationVariables>(CreatePartialDocument, baseOptions);
      }
export type CreatePartialMutationHookResult = ReturnType<typeof useCreatePartialMutation>;
export type CreatePartialMutationResult = Apollo.MutationResult<CreatePartialMutation>;
export type CreatePartialMutationOptions = Apollo.BaseMutationOptions<CreatePartialMutation, CreatePartialMutationVariables>;
export const UpdatePartialDocument = gql`
    mutation UpdatePartial($id: Int!, $cmsPartial: CmsPartialInput!) {
  updateCmsPartial(input: {id: $id, cms_partial: $cmsPartial}) {
    cms_partial {
      id
      ...CmsPartialFields
    }
  }
}
    ${CmsPartialFieldsFragmentDoc}`;
export type UpdatePartialMutationFn = Apollo.MutationFunction<UpdatePartialMutation, UpdatePartialMutationVariables>;

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
export function useUpdatePartialMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePartialMutation, UpdatePartialMutationVariables>) {
        return Apollo.useMutation<UpdatePartialMutation, UpdatePartialMutationVariables>(UpdatePartialDocument, baseOptions);
      }
export type UpdatePartialMutationHookResult = ReturnType<typeof useUpdatePartialMutation>;
export type UpdatePartialMutationResult = Apollo.MutationResult<UpdatePartialMutation>;
export type UpdatePartialMutationOptions = Apollo.BaseMutationOptions<UpdatePartialMutation, UpdatePartialMutationVariables>;
export const DeletePartialDocument = gql`
    mutation DeletePartial($id: Int!) {
  deleteCmsPartial(input: {id: $id}) {
    clientMutationId
  }
}
    `;
export type DeletePartialMutationFn = Apollo.MutationFunction<DeletePartialMutation, DeletePartialMutationVariables>;

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
export function useDeletePartialMutation(baseOptions?: Apollo.MutationHookOptions<DeletePartialMutation, DeletePartialMutationVariables>) {
        return Apollo.useMutation<DeletePartialMutation, DeletePartialMutationVariables>(DeletePartialDocument, baseOptions);
      }
export type DeletePartialMutationHookResult = ReturnType<typeof useDeletePartialMutation>;
export type DeletePartialMutationResult = Apollo.MutationResult<DeletePartialMutation>;
export type DeletePartialMutationOptions = Apollo.BaseMutationOptions<DeletePartialMutation, DeletePartialMutationVariables>;