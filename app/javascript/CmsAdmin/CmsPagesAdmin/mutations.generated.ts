/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { CmsPageFieldsFragment } from './queries.generated';
import { gql } from '@apollo/client';
import { CmsPageFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
export type CreatePageMutationVariables = Types.Exact<{
  page: Types.PageInput;
}>;


export type CreatePageMutation = (
  { __typename: 'Mutation' }
  & { createPage?: Types.Maybe<(
    { __typename: 'CreatePagePayload' }
    & { page: (
      { __typename: 'Page' }
      & Pick<Types.Page, 'id'>
      & CmsPageFieldsFragment
    ) }
  )> }
);

export type UpdatePageMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
  page: Types.PageInput;
}>;


export type UpdatePageMutation = (
  { __typename: 'Mutation' }
  & { updatePage?: Types.Maybe<(
    { __typename: 'UpdatePagePayload' }
    & { page: (
      { __typename: 'Page' }
      & Pick<Types.Page, 'id'>
      & CmsPageFieldsFragment
    ) }
  )> }
);

export type DeletePageMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type DeletePageMutation = (
  { __typename: 'Mutation' }
  & { deletePage?: Types.Maybe<(
    { __typename: 'DeletePagePayload' }
    & Pick<Types.DeletePagePayload, 'clientMutationId'>
  )> }
);


export const CreatePageDocument = gql`
    mutation CreatePage($page: PageInput!) {
  createPage(input: {page: $page}) {
    page {
      id
      ...CmsPageFields
    }
  }
}
    ${CmsPageFieldsFragmentDoc}`;
export type CreatePageMutationFn = Apollo.MutationFunction<CreatePageMutation, CreatePageMutationVariables>;

/**
 * __useCreatePageMutation__
 *
 * To run a mutation, you first call `useCreatePageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPageMutation, { data, loading, error }] = useCreatePageMutation({
 *   variables: {
 *      page: // value for 'page'
 *   },
 * });
 */
export function useCreatePageMutation(baseOptions?: Apollo.MutationHookOptions<CreatePageMutation, CreatePageMutationVariables>) {
        return Apollo.useMutation<CreatePageMutation, CreatePageMutationVariables>(CreatePageDocument, baseOptions);
      }
export type CreatePageMutationHookResult = ReturnType<typeof useCreatePageMutation>;
export type CreatePageMutationResult = Apollo.MutationResult<CreatePageMutation>;
export type CreatePageMutationOptions = Apollo.BaseMutationOptions<CreatePageMutation, CreatePageMutationVariables>;
export const UpdatePageDocument = gql`
    mutation UpdatePage($id: Int!, $page: PageInput!) {
  updatePage(input: {id: $id, page: $page}) {
    page {
      id
      ...CmsPageFields
    }
  }
}
    ${CmsPageFieldsFragmentDoc}`;
export type UpdatePageMutationFn = Apollo.MutationFunction<UpdatePageMutation, UpdatePageMutationVariables>;

/**
 * __useUpdatePageMutation__
 *
 * To run a mutation, you first call `useUpdatePageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePageMutation, { data, loading, error }] = useUpdatePageMutation({
 *   variables: {
 *      id: // value for 'id'
 *      page: // value for 'page'
 *   },
 * });
 */
export function useUpdatePageMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePageMutation, UpdatePageMutationVariables>) {
        return Apollo.useMutation<UpdatePageMutation, UpdatePageMutationVariables>(UpdatePageDocument, baseOptions);
      }
export type UpdatePageMutationHookResult = ReturnType<typeof useUpdatePageMutation>;
export type UpdatePageMutationResult = Apollo.MutationResult<UpdatePageMutation>;
export type UpdatePageMutationOptions = Apollo.BaseMutationOptions<UpdatePageMutation, UpdatePageMutationVariables>;
export const DeletePageDocument = gql`
    mutation DeletePage($id: Int!) {
  deletePage(input: {id: $id}) {
    clientMutationId
  }
}
    `;
export type DeletePageMutationFn = Apollo.MutationFunction<DeletePageMutation, DeletePageMutationVariables>;

/**
 * __useDeletePageMutation__
 *
 * To run a mutation, you first call `useDeletePageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePageMutation, { data, loading, error }] = useDeletePageMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeletePageMutation(baseOptions?: Apollo.MutationHookOptions<DeletePageMutation, DeletePageMutationVariables>) {
        return Apollo.useMutation<DeletePageMutation, DeletePageMutationVariables>(DeletePageDocument, baseOptions);
      }
export type DeletePageMutationHookResult = ReturnType<typeof useDeletePageMutation>;
export type DeletePageMutationResult = Apollo.MutationResult<DeletePageMutation>;
export type DeletePageMutationOptions = Apollo.BaseMutationOptions<DeletePageMutation, DeletePageMutationVariables>;