/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { RankedChoiceUserConstraintFieldsFragmentDoc } from './queries.generated';
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

export type CreateMyRankedChoiceUserConstraintMutationVariables = Types.Exact<{
  rankedChoiceUserConstraint: Types.RankedChoiceUserConstraintInput;
}>;


export type CreateMyRankedChoiceUserConstraintMutationData = { __typename: 'Mutation', createRankedChoiceUserConstraint: { __typename: 'CreateRankedChoiceUserConstraintPayload', ranked_choice_user_constraint: { __typename: 'RankedChoiceUserConstraint', id: string, start?: string | null, finish?: string | null, maximum_signups: number } } };

export type UpdateRankedChoiceUserConstraintMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  rankedChoiceUserConstraint: Types.RankedChoiceUserConstraintInput;
}>;


export type UpdateRankedChoiceUserConstraintMutationData = { __typename: 'Mutation', updateRankedChoiceUserConstraint: { __typename: 'UpdateRankedChoiceUserConstraintPayload', ranked_choice_user_constraint: { __typename: 'RankedChoiceUserConstraint', id: string, start?: string | null, finish?: string | null, maximum_signups: number } } };

export type DeleteRankedChoiceUserConstraintMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type DeleteRankedChoiceUserConstraintMutationData = { __typename: 'Mutation', deleteRankedChoiceUserConstraint: { __typename: 'DeleteRankedChoiceUserConstraintPayload', clientMutationId?: string | null } };


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
export const CreateMyRankedChoiceUserConstraintDocument = gql`
    mutation CreateMyRankedChoiceUserConstraint($rankedChoiceUserConstraint: RankedChoiceUserConstraintInput!) {
  createRankedChoiceUserConstraint(
    input: {rankedChoiceUserConstraint: $rankedChoiceUserConstraint}
  ) {
    ranked_choice_user_constraint {
      id
      ...RankedChoiceUserConstraintFields
    }
  }
}
    ${RankedChoiceUserConstraintFieldsFragmentDoc}`;
export type CreateMyRankedChoiceUserConstraintMutationFn = Apollo.MutationFunction<CreateMyRankedChoiceUserConstraintMutationData, CreateMyRankedChoiceUserConstraintMutationVariables>;

/**
 * __useCreateMyRankedChoiceUserConstraintMutation__
 *
 * To run a mutation, you first call `useCreateMyRankedChoiceUserConstraintMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMyRankedChoiceUserConstraintMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMyRankedChoiceUserConstraintMutation, { data, loading, error }] = useCreateMyRankedChoiceUserConstraintMutation({
 *   variables: {
 *      rankedChoiceUserConstraint: // value for 'rankedChoiceUserConstraint'
 *   },
 * });
 */
export function useCreateMyRankedChoiceUserConstraintMutation(baseOptions?: Apollo.MutationHookOptions<CreateMyRankedChoiceUserConstraintMutationData, CreateMyRankedChoiceUserConstraintMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMyRankedChoiceUserConstraintMutationData, CreateMyRankedChoiceUserConstraintMutationVariables>(CreateMyRankedChoiceUserConstraintDocument, options);
      }
export type CreateMyRankedChoiceUserConstraintMutationHookResult = ReturnType<typeof useCreateMyRankedChoiceUserConstraintMutation>;
export type CreateMyRankedChoiceUserConstraintMutationResult = Apollo.MutationResult<CreateMyRankedChoiceUserConstraintMutationData>;
export type CreateMyRankedChoiceUserConstraintMutationOptions = Apollo.BaseMutationOptions<CreateMyRankedChoiceUserConstraintMutationData, CreateMyRankedChoiceUserConstraintMutationVariables>;
export const UpdateRankedChoiceUserConstraintDocument = gql`
    mutation UpdateRankedChoiceUserConstraint($id: ID!, $rankedChoiceUserConstraint: RankedChoiceUserConstraintInput!) {
  updateRankedChoiceUserConstraint(
    input: {id: $id, rankedChoiceUserConstraint: $rankedChoiceUserConstraint}
  ) {
    ranked_choice_user_constraint {
      id
      ...RankedChoiceUserConstraintFields
    }
  }
}
    ${RankedChoiceUserConstraintFieldsFragmentDoc}`;
export type UpdateRankedChoiceUserConstraintMutationFn = Apollo.MutationFunction<UpdateRankedChoiceUserConstraintMutationData, UpdateRankedChoiceUserConstraintMutationVariables>;

/**
 * __useUpdateRankedChoiceUserConstraintMutation__
 *
 * To run a mutation, you first call `useUpdateRankedChoiceUserConstraintMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRankedChoiceUserConstraintMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRankedChoiceUserConstraintMutation, { data, loading, error }] = useUpdateRankedChoiceUserConstraintMutation({
 *   variables: {
 *      id: // value for 'id'
 *      rankedChoiceUserConstraint: // value for 'rankedChoiceUserConstraint'
 *   },
 * });
 */
export function useUpdateRankedChoiceUserConstraintMutation(baseOptions?: Apollo.MutationHookOptions<UpdateRankedChoiceUserConstraintMutationData, UpdateRankedChoiceUserConstraintMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateRankedChoiceUserConstraintMutationData, UpdateRankedChoiceUserConstraintMutationVariables>(UpdateRankedChoiceUserConstraintDocument, options);
      }
export type UpdateRankedChoiceUserConstraintMutationHookResult = ReturnType<typeof useUpdateRankedChoiceUserConstraintMutation>;
export type UpdateRankedChoiceUserConstraintMutationResult = Apollo.MutationResult<UpdateRankedChoiceUserConstraintMutationData>;
export type UpdateRankedChoiceUserConstraintMutationOptions = Apollo.BaseMutationOptions<UpdateRankedChoiceUserConstraintMutationData, UpdateRankedChoiceUserConstraintMutationVariables>;
export const DeleteRankedChoiceUserConstraintDocument = gql`
    mutation DeleteRankedChoiceUserConstraint($id: ID!) {
  deleteRankedChoiceUserConstraint(input: {id: $id}) {
    clientMutationId
  }
}
    `;
export type DeleteRankedChoiceUserConstraintMutationFn = Apollo.MutationFunction<DeleteRankedChoiceUserConstraintMutationData, DeleteRankedChoiceUserConstraintMutationVariables>;

/**
 * __useDeleteRankedChoiceUserConstraintMutation__
 *
 * To run a mutation, you first call `useDeleteRankedChoiceUserConstraintMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRankedChoiceUserConstraintMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteRankedChoiceUserConstraintMutation, { data, loading, error }] = useDeleteRankedChoiceUserConstraintMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteRankedChoiceUserConstraintMutation(baseOptions?: Apollo.MutationHookOptions<DeleteRankedChoiceUserConstraintMutationData, DeleteRankedChoiceUserConstraintMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteRankedChoiceUserConstraintMutationData, DeleteRankedChoiceUserConstraintMutationVariables>(DeleteRankedChoiceUserConstraintDocument, options);
      }
export type DeleteRankedChoiceUserConstraintMutationHookResult = ReturnType<typeof useDeleteRankedChoiceUserConstraintMutation>;
export type DeleteRankedChoiceUserConstraintMutationResult = Apollo.MutationResult<DeleteRankedChoiceUserConstraintMutationData>;
export type DeleteRankedChoiceUserConstraintMutationOptions = Apollo.BaseMutationOptions<DeleteRankedChoiceUserConstraintMutationData, DeleteRankedChoiceUserConstraintMutationVariables>;