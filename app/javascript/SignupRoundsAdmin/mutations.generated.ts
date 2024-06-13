/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { SignupRoundFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateSignupRoundMutationVariables = Types.Exact<{
  conventionId: Types.Scalars['ID']['input'];
  signupRound: Types.SignupRoundInput;
}>;


export type CreateSignupRoundMutationData = { __typename: 'Mutation', createSignupRound: { __typename: 'CreateSignupRoundPayload', signup_round: { __typename: 'SignupRound', id: string, maximum_event_signups: string, ranked_choice_order?: Types.RankedChoiceOrder | null, start?: string | null, executed_at?: string | null } } };

export type UpdateSignupRoundMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  signupRound: Types.SignupRoundInput;
}>;


export type UpdateSignupRoundMutationData = { __typename: 'Mutation', updateSignupRound: { __typename: 'UpdateSignupRoundPayload', signup_round: { __typename: 'SignupRound', id: string, maximum_event_signups: string, ranked_choice_order?: Types.RankedChoiceOrder | null, start?: string | null, executed_at?: string | null } } };

export type DeleteSignupRoundMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type DeleteSignupRoundMutationData = { __typename: 'Mutation', deleteSignupRound: { __typename: 'DeleteSignupRoundPayload', clientMutationId?: string | null } };


export const CreateSignupRoundDocument = gql`
    mutation CreateSignupRound($conventionId: ID!, $signupRound: SignupRoundInput!) {
  createSignupRound(
    input: {conventionId: $conventionId, signupRound: $signupRound}
  ) {
    signup_round {
      id
      ...SignupRoundFields
    }
  }
}
    ${SignupRoundFieldsFragmentDoc}`;
export type CreateSignupRoundMutationFn = Apollo.MutationFunction<CreateSignupRoundMutationData, CreateSignupRoundMutationVariables>;

/**
 * __useCreateSignupRoundMutation__
 *
 * To run a mutation, you first call `useCreateSignupRoundMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSignupRoundMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSignupRoundMutation, { data, loading, error }] = useCreateSignupRoundMutation({
 *   variables: {
 *      conventionId: // value for 'conventionId'
 *      signupRound: // value for 'signupRound'
 *   },
 * });
 */
export function useCreateSignupRoundMutation(baseOptions?: Apollo.MutationHookOptions<CreateSignupRoundMutationData, CreateSignupRoundMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSignupRoundMutationData, CreateSignupRoundMutationVariables>(CreateSignupRoundDocument, options);
      }
export type CreateSignupRoundMutationHookResult = ReturnType<typeof useCreateSignupRoundMutation>;
export type CreateSignupRoundMutationResult = Apollo.MutationResult<CreateSignupRoundMutationData>;
export type CreateSignupRoundMutationOptions = Apollo.BaseMutationOptions<CreateSignupRoundMutationData, CreateSignupRoundMutationVariables>;
export const UpdateSignupRoundDocument = gql`
    mutation UpdateSignupRound($id: ID!, $signupRound: SignupRoundInput!) {
  updateSignupRound(input: {id: $id, signupRound: $signupRound}) {
    signup_round {
      id
      ...SignupRoundFields
    }
  }
}
    ${SignupRoundFieldsFragmentDoc}`;
export type UpdateSignupRoundMutationFn = Apollo.MutationFunction<UpdateSignupRoundMutationData, UpdateSignupRoundMutationVariables>;

/**
 * __useUpdateSignupRoundMutation__
 *
 * To run a mutation, you first call `useUpdateSignupRoundMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSignupRoundMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSignupRoundMutation, { data, loading, error }] = useUpdateSignupRoundMutation({
 *   variables: {
 *      id: // value for 'id'
 *      signupRound: // value for 'signupRound'
 *   },
 * });
 */
export function useUpdateSignupRoundMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSignupRoundMutationData, UpdateSignupRoundMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSignupRoundMutationData, UpdateSignupRoundMutationVariables>(UpdateSignupRoundDocument, options);
      }
export type UpdateSignupRoundMutationHookResult = ReturnType<typeof useUpdateSignupRoundMutation>;
export type UpdateSignupRoundMutationResult = Apollo.MutationResult<UpdateSignupRoundMutationData>;
export type UpdateSignupRoundMutationOptions = Apollo.BaseMutationOptions<UpdateSignupRoundMutationData, UpdateSignupRoundMutationVariables>;
export const DeleteSignupRoundDocument = gql`
    mutation DeleteSignupRound($id: ID!) {
  deleteSignupRound(input: {id: $id}) {
    clientMutationId
  }
}
    `;
export type DeleteSignupRoundMutationFn = Apollo.MutationFunction<DeleteSignupRoundMutationData, DeleteSignupRoundMutationVariables>;

/**
 * __useDeleteSignupRoundMutation__
 *
 * To run a mutation, you first call `useDeleteSignupRoundMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSignupRoundMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSignupRoundMutation, { data, loading, error }] = useDeleteSignupRoundMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteSignupRoundMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSignupRoundMutationData, DeleteSignupRoundMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSignupRoundMutationData, DeleteSignupRoundMutationVariables>(DeleteSignupRoundDocument, options);
      }
export type DeleteSignupRoundMutationHookResult = ReturnType<typeof useDeleteSignupRoundMutation>;
export type DeleteSignupRoundMutationResult = Apollo.MutationResult<DeleteSignupRoundMutationData>;
export type DeleteSignupRoundMutationOptions = Apollo.BaseMutationOptions<DeleteSignupRoundMutationData, DeleteSignupRoundMutationVariables>;