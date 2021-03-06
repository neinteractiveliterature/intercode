/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { AdminNavigationItemFieldsFragment } from './queries.generated';
import { gql } from '@apollo/client';
import { AdminNavigationItemFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CreateNavigationItemMutationVariables = Types.Exact<{
  navigationItem: Types.CmsNavigationItemInput;
}>;


export type CreateNavigationItemMutationData = (
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


export type UpdateNavigationItemMutationData = (
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


export type DeleteNavigationItemMutationData = (
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
  sortItems: Array<Types.UpdateCmsNavigationItemInput> | Types.UpdateCmsNavigationItemInput;
}>;


export type SortNavigationItemsMutationData = (
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
export type CreateNavigationItemMutationFn = Apollo.MutationFunction<CreateNavigationItemMutationData, CreateNavigationItemMutationVariables>;

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
export function useCreateNavigationItemMutation(baseOptions?: Apollo.MutationHookOptions<CreateNavigationItemMutationData, CreateNavigationItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateNavigationItemMutationData, CreateNavigationItemMutationVariables>(CreateNavigationItemDocument, options);
      }
export type CreateNavigationItemMutationHookResult = ReturnType<typeof useCreateNavigationItemMutation>;
export type CreateNavigationItemMutationResult = Apollo.MutationResult<CreateNavigationItemMutationData>;
export type CreateNavigationItemMutationOptions = Apollo.BaseMutationOptions<CreateNavigationItemMutationData, CreateNavigationItemMutationVariables>;
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
export type UpdateNavigationItemMutationFn = Apollo.MutationFunction<UpdateNavigationItemMutationData, UpdateNavigationItemMutationVariables>;

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
export function useUpdateNavigationItemMutation(baseOptions?: Apollo.MutationHookOptions<UpdateNavigationItemMutationData, UpdateNavigationItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateNavigationItemMutationData, UpdateNavigationItemMutationVariables>(UpdateNavigationItemDocument, options);
      }
export type UpdateNavigationItemMutationHookResult = ReturnType<typeof useUpdateNavigationItemMutation>;
export type UpdateNavigationItemMutationResult = Apollo.MutationResult<UpdateNavigationItemMutationData>;
export type UpdateNavigationItemMutationOptions = Apollo.BaseMutationOptions<UpdateNavigationItemMutationData, UpdateNavigationItemMutationVariables>;
export const DeleteNavigationItemDocument = gql`
    mutation DeleteNavigationItem($id: Int!) {
  deleteCmsNavigationItem(input: {id: $id}) {
    cms_navigation_item {
      id
    }
  }
}
    `;
export type DeleteNavigationItemMutationFn = Apollo.MutationFunction<DeleteNavigationItemMutationData, DeleteNavigationItemMutationVariables>;

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
export function useDeleteNavigationItemMutation(baseOptions?: Apollo.MutationHookOptions<DeleteNavigationItemMutationData, DeleteNavigationItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteNavigationItemMutationData, DeleteNavigationItemMutationVariables>(DeleteNavigationItemDocument, options);
      }
export type DeleteNavigationItemMutationHookResult = ReturnType<typeof useDeleteNavigationItemMutation>;
export type DeleteNavigationItemMutationResult = Apollo.MutationResult<DeleteNavigationItemMutationData>;
export type DeleteNavigationItemMutationOptions = Apollo.BaseMutationOptions<DeleteNavigationItemMutationData, DeleteNavigationItemMutationVariables>;
export const SortNavigationItemsDocument = gql`
    mutation SortNavigationItems($sortItems: [UpdateCmsNavigationItemInput!]!) {
  sortCmsNavigationItems(input: {sort_items: $sortItems}) {
    clientMutationId
  }
}
    `;
export type SortNavigationItemsMutationFn = Apollo.MutationFunction<SortNavigationItemsMutationData, SortNavigationItemsMutationVariables>;

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
export function useSortNavigationItemsMutation(baseOptions?: Apollo.MutationHookOptions<SortNavigationItemsMutationData, SortNavigationItemsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SortNavigationItemsMutationData, SortNavigationItemsMutationVariables>(SortNavigationItemsDocument, options);
      }
export type SortNavigationItemsMutationHookResult = ReturnType<typeof useSortNavigationItemsMutation>;
export type SortNavigationItemsMutationResult = Apollo.MutationResult<SortNavigationItemsMutationData>;
export type SortNavigationItemsMutationOptions = Apollo.BaseMutationOptions<SortNavigationItemsMutationData, SortNavigationItemsMutationVariables>;