/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { AdminNavigationItemFieldsFragment } from './queries.generated';
import { gql } from '@apollo/client';
import { AdminNavigationItemFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
export type CreateNavigationItemMutationVariables = Types.Exact<{
  navigationItem: Types.CmsNavigationItemInput;
}>;


export type CreateNavigationItemMutation = (
  { __typename: 'Mutation' }
  & { createCmsNavigationItem?: Types.Maybe<(
    { __typename: 'CreateCmsNavigationItemPayload' }
    & { cms_navigation_item: (
      { __typename: 'CmsNavigationItem' }
      & Pick<Types.CmsNavigationItem, 'id'>
      & AdminNavigationItemFieldsFragment
    ) }
  )> }
);

export type UpdateNavigationItemMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
  navigationItem: Types.CmsNavigationItemInput;
}>;


export type UpdateNavigationItemMutation = (
  { __typename: 'Mutation' }
  & { updateCmsNavigationItem?: Types.Maybe<(
    { __typename: 'UpdateCmsNavigationItemPayload' }
    & { cms_navigation_item: (
      { __typename: 'CmsNavigationItem' }
      & Pick<Types.CmsNavigationItem, 'id'>
      & AdminNavigationItemFieldsFragment
    ) }
  )> }
);

export type DeleteNavigationItemMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type DeleteNavigationItemMutation = (
  { __typename: 'Mutation' }
  & { deleteCmsNavigationItem?: Types.Maybe<(
    { __typename: 'DeleteCmsNavigationItemPayload' }
    & { cms_navigation_item: (
      { __typename: 'CmsNavigationItem' }
      & Pick<Types.CmsNavigationItem, 'id'>
    ) }
  )> }
);

export type SortNavigationItemsMutationVariables = Types.Exact<{
  sortItems: Array<Types.UpdateCmsNavigationItemInput>;
}>;


export type SortNavigationItemsMutation = (
  { __typename: 'Mutation' }
  & { sortCmsNavigationItems?: Types.Maybe<(
    { __typename: 'SortCmsNavigationItemsPayload' }
    & Pick<Types.SortCmsNavigationItemsPayload, 'clientMutationId'>
  )> }
);


export const CreateNavigationItemDocument = gql`
    mutation CreateNavigationItem($navigationItem: CmsNavigationItemInput!) {
  createCmsNavigationItem(input: {cms_navigation_item: $navigationItem}) {
    cms_navigation_item {
      id
      ...AdminNavigationItemFields
    }
  }
}
    ${AdminNavigationItemFieldsFragmentDoc}`;
export type CreateNavigationItemMutationFn = Apollo.MutationFunction<CreateNavigationItemMutation, CreateNavigationItemMutationVariables>;

/**
 * __useCreateNavigationItemMutation__
 *
 * To run a mutation, you first call `useCreateNavigationItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateNavigationItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createNavigationItemMutation, { data, loading, error }] = useCreateNavigationItemMutation({
 *   variables: {
 *      navigationItem: // value for 'navigationItem'
 *   },
 * });
 */
export function useCreateNavigationItemMutation(baseOptions?: Apollo.MutationHookOptions<CreateNavigationItemMutation, CreateNavigationItemMutationVariables>) {
        return Apollo.useMutation<CreateNavigationItemMutation, CreateNavigationItemMutationVariables>(CreateNavigationItemDocument, baseOptions);
      }
export type CreateNavigationItemMutationHookResult = ReturnType<typeof useCreateNavigationItemMutation>;
export type CreateNavigationItemMutationResult = Apollo.MutationResult<CreateNavigationItemMutation>;
export type CreateNavigationItemMutationOptions = Apollo.BaseMutationOptions<CreateNavigationItemMutation, CreateNavigationItemMutationVariables>;
export const UpdateNavigationItemDocument = gql`
    mutation UpdateNavigationItem($id: Int!, $navigationItem: CmsNavigationItemInput!) {
  updateCmsNavigationItem(input: {id: $id, cms_navigation_item: $navigationItem}) {
    cms_navigation_item {
      id
      ...AdminNavigationItemFields
    }
  }
}
    ${AdminNavigationItemFieldsFragmentDoc}`;
export type UpdateNavigationItemMutationFn = Apollo.MutationFunction<UpdateNavigationItemMutation, UpdateNavigationItemMutationVariables>;

/**
 * __useUpdateNavigationItemMutation__
 *
 * To run a mutation, you first call `useUpdateNavigationItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateNavigationItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateNavigationItemMutation, { data, loading, error }] = useUpdateNavigationItemMutation({
 *   variables: {
 *      id: // value for 'id'
 *      navigationItem: // value for 'navigationItem'
 *   },
 * });
 */
export function useUpdateNavigationItemMutation(baseOptions?: Apollo.MutationHookOptions<UpdateNavigationItemMutation, UpdateNavigationItemMutationVariables>) {
        return Apollo.useMutation<UpdateNavigationItemMutation, UpdateNavigationItemMutationVariables>(UpdateNavigationItemDocument, baseOptions);
      }
export type UpdateNavigationItemMutationHookResult = ReturnType<typeof useUpdateNavigationItemMutation>;
export type UpdateNavigationItemMutationResult = Apollo.MutationResult<UpdateNavigationItemMutation>;
export type UpdateNavigationItemMutationOptions = Apollo.BaseMutationOptions<UpdateNavigationItemMutation, UpdateNavigationItemMutationVariables>;
export const DeleteNavigationItemDocument = gql`
    mutation DeleteNavigationItem($id: Int!) {
  deleteCmsNavigationItem(input: {id: $id}) {
    cms_navigation_item {
      id
    }
  }
}
    `;
export type DeleteNavigationItemMutationFn = Apollo.MutationFunction<DeleteNavigationItemMutation, DeleteNavigationItemMutationVariables>;

/**
 * __useDeleteNavigationItemMutation__
 *
 * To run a mutation, you first call `useDeleteNavigationItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteNavigationItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteNavigationItemMutation, { data, loading, error }] = useDeleteNavigationItemMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteNavigationItemMutation(baseOptions?: Apollo.MutationHookOptions<DeleteNavigationItemMutation, DeleteNavigationItemMutationVariables>) {
        return Apollo.useMutation<DeleteNavigationItemMutation, DeleteNavigationItemMutationVariables>(DeleteNavigationItemDocument, baseOptions);
      }
export type DeleteNavigationItemMutationHookResult = ReturnType<typeof useDeleteNavigationItemMutation>;
export type DeleteNavigationItemMutationResult = Apollo.MutationResult<DeleteNavigationItemMutation>;
export type DeleteNavigationItemMutationOptions = Apollo.BaseMutationOptions<DeleteNavigationItemMutation, DeleteNavigationItemMutationVariables>;
export const SortNavigationItemsDocument = gql`
    mutation SortNavigationItems($sortItems: [UpdateCmsNavigationItemInput!]!) {
  sortCmsNavigationItems(input: {sort_items: $sortItems}) {
    clientMutationId
  }
}
    `;
export type SortNavigationItemsMutationFn = Apollo.MutationFunction<SortNavigationItemsMutation, SortNavigationItemsMutationVariables>;

/**
 * __useSortNavigationItemsMutation__
 *
 * To run a mutation, you first call `useSortNavigationItemsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSortNavigationItemsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sortNavigationItemsMutation, { data, loading, error }] = useSortNavigationItemsMutation({
 *   variables: {
 *      sortItems: // value for 'sortItems'
 *   },
 * });
 */
export function useSortNavigationItemsMutation(baseOptions?: Apollo.MutationHookOptions<SortNavigationItemsMutation, SortNavigationItemsMutationVariables>) {
        return Apollo.useMutation<SortNavigationItemsMutation, SortNavigationItemsMutationVariables>(SortNavigationItemsDocument, baseOptions);
      }
export type SortNavigationItemsMutationHookResult = ReturnType<typeof useSortNavigationItemsMutation>;
export type SortNavigationItemsMutationResult = Apollo.MutationResult<SortNavigationItemsMutation>;
export type SortNavigationItemsMutationOptions = Apollo.BaseMutationOptions<SortNavigationItemsMutation, SortNavigationItemsMutationVariables>;