/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { AdminNavigationItemFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateNavigationItemMutationVariables = Types.Exact<{
  navigationItem: Types.CmsNavigationItemInput;
}>;


export type CreateNavigationItemMutationData = { __typename: 'Mutation', createCmsNavigationItem: { __typename: 'CreateCmsNavigationItemPayload', cms_navigation_item: { __typename: 'CmsNavigationItem', id: string, position?: number | null, title?: string | null, page?: { __typename: 'Page', id: string } | null, navigation_section?: { __typename: 'CmsNavigationItem', id: string } | null } } };

export type UpdateNavigationItemMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  navigationItem: Types.CmsNavigationItemInput;
}>;


export type UpdateNavigationItemMutationData = { __typename: 'Mutation', updateCmsNavigationItem: { __typename: 'UpdateCmsNavigationItemPayload', cms_navigation_item: { __typename: 'CmsNavigationItem', id: string, position?: number | null, title?: string | null, page?: { __typename: 'Page', id: string } | null, navigation_section?: { __typename: 'CmsNavigationItem', id: string } | null } } };

export type DeleteNavigationItemMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type DeleteNavigationItemMutationData = { __typename: 'Mutation', deleteCmsNavigationItem: { __typename: 'DeleteCmsNavigationItemPayload', cms_navigation_item: { __typename: 'CmsNavigationItem', id: string } } };

export type SortNavigationItemsMutationVariables = Types.Exact<{
  sortItems: Array<Types.UpdateCmsNavigationItemInput> | Types.UpdateCmsNavigationItemInput;
}>;


export type SortNavigationItemsMutationData = { __typename: 'Mutation', sortCmsNavigationItems: { __typename: 'SortCmsNavigationItemsPayload', clientMutationId?: string | null } };


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
    mutation UpdateNavigationItem($id: ID!, $navigationItem: CmsNavigationItemInput!) {
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
    mutation DeleteNavigationItem($id: ID!) {
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