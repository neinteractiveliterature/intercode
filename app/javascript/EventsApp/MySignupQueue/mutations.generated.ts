/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DeleteSignupRankedChoiceMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type DeleteSignupRankedChoiceMutationData = { __typename: 'Mutation', deleteSignupRankedChoice: { __typename: 'DeleteSignupRankedChoicePayload', clientMutationId?: string | null } };

export type UpdateSignupRankedChoicePriorityMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  priority: Types.Scalars['Int']['input'];
}>;


export type UpdateSignupRankedChoicePriorityMutationData = { __typename: 'Mutation', updateSignupRankedChoicePriority: { __typename: 'UpdateSignupRankedChoicePriorityPayload', clientMutationId?: string | null } };


export const DeleteSignupRankedChoiceDocument = gql`
    mutation DeleteSignupRankedChoice($id: ID!) {
  deleteSignupRankedChoice(input: {id: $id}) {
    clientMutationId
  }
}
    `;
export type DeleteSignupRankedChoiceMutationFn = Apollo.MutationFunction<DeleteSignupRankedChoiceMutationData, DeleteSignupRankedChoiceMutationVariables>;

/**
 * __useDeleteSignupRankedChoiceMutation__
 *
 * To run a mutation, you first call `useDeleteSignupRankedChoiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSignupRankedChoiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSignupRankedChoiceMutation, { data, loading, error }] = useDeleteSignupRankedChoiceMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteSignupRankedChoiceMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSignupRankedChoiceMutationData, DeleteSignupRankedChoiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSignupRankedChoiceMutationData, DeleteSignupRankedChoiceMutationVariables>(DeleteSignupRankedChoiceDocument, options);
      }
export type DeleteSignupRankedChoiceMutationHookResult = ReturnType<typeof useDeleteSignupRankedChoiceMutation>;
export type DeleteSignupRankedChoiceMutationResult = Apollo.MutationResult<DeleteSignupRankedChoiceMutationData>;
export type DeleteSignupRankedChoiceMutationOptions = Apollo.BaseMutationOptions<DeleteSignupRankedChoiceMutationData, DeleteSignupRankedChoiceMutationVariables>;
export const UpdateSignupRankedChoicePriorityDocument = gql`
    mutation UpdateSignupRankedChoicePriority($id: ID!, $priority: Int!) {
  updateSignupRankedChoicePriority(input: {id: $id, priority: $priority}) {
    clientMutationId
  }
}
    `;
export type UpdateSignupRankedChoicePriorityMutationFn = Apollo.MutationFunction<UpdateSignupRankedChoicePriorityMutationData, UpdateSignupRankedChoicePriorityMutationVariables>;

/**
 * __useUpdateSignupRankedChoicePriorityMutation__
 *
 * To run a mutation, you first call `useUpdateSignupRankedChoicePriorityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSignupRankedChoicePriorityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSignupRankedChoicePriorityMutation, { data, loading, error }] = useUpdateSignupRankedChoicePriorityMutation({
 *   variables: {
 *      id: // value for 'id'
 *      priority: // value for 'priority'
 *   },
 * });
 */
export function useUpdateSignupRankedChoicePriorityMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSignupRankedChoicePriorityMutationData, UpdateSignupRankedChoicePriorityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSignupRankedChoicePriorityMutationData, UpdateSignupRankedChoicePriorityMutationVariables>(UpdateSignupRankedChoicePriorityDocument, options);
      }
export type UpdateSignupRankedChoicePriorityMutationHookResult = ReturnType<typeof useUpdateSignupRankedChoicePriorityMutation>;
export type UpdateSignupRankedChoicePriorityMutationResult = Apollo.MutationResult<UpdateSignupRankedChoicePriorityMutationData>;
export type UpdateSignupRankedChoicePriorityMutationOptions = Apollo.BaseMutationOptions<UpdateSignupRankedChoicePriorityMutationData, UpdateSignupRankedChoicePriorityMutationVariables>;