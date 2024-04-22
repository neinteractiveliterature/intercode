/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { MySignupFieldsFragmentDoc, EventPageRunFieldsFragmentDoc, MySignupRequestFieldsFragmentDoc, MySignupRankedChoiceFieldsFragmentDoc } from './queries.generated';
import { RunBasicSignupDataFragmentDoc, CommonConventionDataFragmentDoc } from '../queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateMySignupMutationVariables = Types.Exact<{
  runId: Types.Scalars['ID']['input'];
  requestedBucketKey?: Types.InputMaybe<Types.Scalars['String']['input']>;
  noRequestedBucket?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
}>;


export type CreateMySignupMutationData = { __typename: 'Mutation', createMySignup: { __typename: 'CreateMySignupPayload', signup: { __typename: 'Signup', id: string, state: Types.SignupState, waitlist_position?: number | null, expires_at?: string | null, run: { __typename: 'Run', id: string, title_suffix?: string | null, starts_at: string, current_ability_can_signup_summary_run: boolean, grouped_signup_counts: Array<{ __typename: 'GroupedSignupCount', bucket_key?: string | null, count: number, counted: boolean, state: Types.SignupState, team_member: boolean }>, rooms: Array<{ __typename: 'Room', id: string, name?: string | null }>, my_signups: Array<{ __typename: 'Signup', id: string, state: Types.SignupState, waitlist_position?: number | null, expires_at?: string | null }>, my_signup_requests: Array<{ __typename: 'SignupRequest', id: string, state: Types.SignupRequestState, requested_bucket_key?: string | null, target_run: { __typename: 'Run', id: string }, replace_signup?: { __typename: 'Signup', id: string } | null }>, my_signup_ranked_choices: Array<{ __typename: 'SignupRankedChoice', id: string, state: Types.SignupRankedChoiceState, priority: number, requested_bucket_key?: string | null, target_run: { __typename: 'Run', id: string } }> } } } };

export type WithdrawMySignupMutationVariables = Types.Exact<{
  runId: Types.Scalars['ID']['input'];
}>;


export type WithdrawMySignupMutationData = { __typename: 'Mutation', withdrawMySignup: { __typename: 'WithdrawMySignupPayload', signup: { __typename: 'Signup', id: string, state: Types.SignupState, waitlist_position?: number | null, expires_at?: string | null, run: { __typename: 'Run', id: string, title_suffix?: string | null, starts_at: string, current_ability_can_signup_summary_run: boolean, grouped_signup_counts: Array<{ __typename: 'GroupedSignupCount', bucket_key?: string | null, count: number, counted: boolean, state: Types.SignupState, team_member: boolean }>, rooms: Array<{ __typename: 'Room', id: string, name?: string | null }>, my_signups: Array<{ __typename: 'Signup', id: string, state: Types.SignupState, waitlist_position?: number | null, expires_at?: string | null }>, my_signup_requests: Array<{ __typename: 'SignupRequest', id: string, state: Types.SignupRequestState, requested_bucket_key?: string | null, target_run: { __typename: 'Run', id: string }, replace_signup?: { __typename: 'Signup', id: string } | null }>, my_signup_ranked_choices: Array<{ __typename: 'SignupRankedChoice', id: string, state: Types.SignupRankedChoiceState, priority: number, requested_bucket_key?: string | null, target_run: { __typename: 'Run', id: string } }> } } } };

export type CreateSignupRequestMutationVariables = Types.Exact<{
  targetRunId: Types.Scalars['ID']['input'];
  requestedBucketKey?: Types.InputMaybe<Types.Scalars['String']['input']>;
  replaceSignupId?: Types.InputMaybe<Types.Scalars['ID']['input']>;
}>;


export type CreateSignupRequestMutationData = { __typename: 'Mutation', createSignupRequest: { __typename: 'CreateSignupRequestPayload', signup_request: { __typename: 'SignupRequest', id: string, state: Types.SignupRequestState, requested_bucket_key?: string | null, target_run: { __typename: 'Run', id: string }, replace_signup?: { __typename: 'Signup', id: string } | null } } };

export type WithdrawSignupRequestMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type WithdrawSignupRequestMutationData = { __typename: 'Mutation', withdrawSignupRequest: { __typename: 'WithdrawSignupRequestPayload', signup_request: { __typename: 'SignupRequest', id: string, state: Types.SignupRequestState, requested_bucket_key?: string | null, target_run: { __typename: 'Run', id: string }, replace_signup?: { __typename: 'Signup', id: string } | null } } };

export type CreateSignupRankedChoiceMutationVariables = Types.Exact<{
  targetRunId: Types.Scalars['ID']['input'];
  requestedBucketKey?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type CreateSignupRankedChoiceMutationData = { __typename: 'Mutation', createSignupRankedChoice: { __typename: 'CreateSignupRankedChoicePayload', signup_ranked_choice: { __typename: 'SignupRankedChoice', id: string, state: Types.SignupRankedChoiceState, requested_bucket_key?: string | null, priority: number, target_run: { __typename: 'Run', id: string } } } };


export const CreateMySignupDocument = gql`
    mutation CreateMySignup($runId: ID!, $requestedBucketKey: String, $noRequestedBucket: Boolean) {
  createMySignup(
    input: {runId: $runId, requested_bucket_key: $requestedBucketKey, no_requested_bucket: $noRequestedBucket}
  ) {
    signup {
      id
      ...MySignupFields
      run {
        id
        ...EventPageRunFields
        ...RunBasicSignupData
      }
    }
  }
}
    ${MySignupFieldsFragmentDoc}
${EventPageRunFieldsFragmentDoc}
${RunBasicSignupDataFragmentDoc}`;
export type CreateMySignupMutationFn = Apollo.MutationFunction<CreateMySignupMutationData, CreateMySignupMutationVariables>;

/**
 * __useCreateMySignupMutation__
 *
 * To run a mutation, you first call `useCreateMySignupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMySignupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMySignupMutation, { data, loading, error }] = useCreateMySignupMutation({
 *   variables: {
 *      runId: // value for 'runId'
 *      requestedBucketKey: // value for 'requestedBucketKey'
 *      noRequestedBucket: // value for 'noRequestedBucket'
 *   },
 * });
 */
export function useCreateMySignupMutation(baseOptions?: Apollo.MutationHookOptions<CreateMySignupMutationData, CreateMySignupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMySignupMutationData, CreateMySignupMutationVariables>(CreateMySignupDocument, options);
      }
export type CreateMySignupMutationHookResult = ReturnType<typeof useCreateMySignupMutation>;
export type CreateMySignupMutationResult = Apollo.MutationResult<CreateMySignupMutationData>;
export type CreateMySignupMutationOptions = Apollo.BaseMutationOptions<CreateMySignupMutationData, CreateMySignupMutationVariables>;
export const WithdrawMySignupDocument = gql`
    mutation WithdrawMySignup($runId: ID!) {
  withdrawMySignup(input: {runId: $runId}) {
    signup {
      id
      ...MySignupFields
      run {
        id
        ...EventPageRunFields
        ...RunBasicSignupData
      }
    }
  }
}
    ${MySignupFieldsFragmentDoc}
${EventPageRunFieldsFragmentDoc}
${RunBasicSignupDataFragmentDoc}`;
export type WithdrawMySignupMutationFn = Apollo.MutationFunction<WithdrawMySignupMutationData, WithdrawMySignupMutationVariables>;

/**
 * __useWithdrawMySignupMutation__
 *
 * To run a mutation, you first call `useWithdrawMySignupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useWithdrawMySignupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [withdrawMySignupMutation, { data, loading, error }] = useWithdrawMySignupMutation({
 *   variables: {
 *      runId: // value for 'runId'
 *   },
 * });
 */
export function useWithdrawMySignupMutation(baseOptions?: Apollo.MutationHookOptions<WithdrawMySignupMutationData, WithdrawMySignupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<WithdrawMySignupMutationData, WithdrawMySignupMutationVariables>(WithdrawMySignupDocument, options);
      }
export type WithdrawMySignupMutationHookResult = ReturnType<typeof useWithdrawMySignupMutation>;
export type WithdrawMySignupMutationResult = Apollo.MutationResult<WithdrawMySignupMutationData>;
export type WithdrawMySignupMutationOptions = Apollo.BaseMutationOptions<WithdrawMySignupMutationData, WithdrawMySignupMutationVariables>;
export const CreateSignupRequestDocument = gql`
    mutation CreateSignupRequest($targetRunId: ID!, $requestedBucketKey: String, $replaceSignupId: ID) {
  createSignupRequest(
    input: {targetRunId: $targetRunId, requested_bucket_key: $requestedBucketKey, replaceSignupId: $replaceSignupId}
  ) {
    signup_request {
      id
      ...MySignupRequestFields
    }
  }
}
    ${MySignupRequestFieldsFragmentDoc}`;
export type CreateSignupRequestMutationFn = Apollo.MutationFunction<CreateSignupRequestMutationData, CreateSignupRequestMutationVariables>;

/**
 * __useCreateSignupRequestMutation__
 *
 * To run a mutation, you first call `useCreateSignupRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSignupRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSignupRequestMutation, { data, loading, error }] = useCreateSignupRequestMutation({
 *   variables: {
 *      targetRunId: // value for 'targetRunId'
 *      requestedBucketKey: // value for 'requestedBucketKey'
 *      replaceSignupId: // value for 'replaceSignupId'
 *   },
 * });
 */
export function useCreateSignupRequestMutation(baseOptions?: Apollo.MutationHookOptions<CreateSignupRequestMutationData, CreateSignupRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSignupRequestMutationData, CreateSignupRequestMutationVariables>(CreateSignupRequestDocument, options);
      }
export type CreateSignupRequestMutationHookResult = ReturnType<typeof useCreateSignupRequestMutation>;
export type CreateSignupRequestMutationResult = Apollo.MutationResult<CreateSignupRequestMutationData>;
export type CreateSignupRequestMutationOptions = Apollo.BaseMutationOptions<CreateSignupRequestMutationData, CreateSignupRequestMutationVariables>;
export const WithdrawSignupRequestDocument = gql`
    mutation WithdrawSignupRequest($id: ID!) {
  withdrawSignupRequest(input: {id: $id}) {
    signup_request {
      id
      ...MySignupRequestFields
    }
  }
}
    ${MySignupRequestFieldsFragmentDoc}`;
export type WithdrawSignupRequestMutationFn = Apollo.MutationFunction<WithdrawSignupRequestMutationData, WithdrawSignupRequestMutationVariables>;

/**
 * __useWithdrawSignupRequestMutation__
 *
 * To run a mutation, you first call `useWithdrawSignupRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useWithdrawSignupRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [withdrawSignupRequestMutation, { data, loading, error }] = useWithdrawSignupRequestMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useWithdrawSignupRequestMutation(baseOptions?: Apollo.MutationHookOptions<WithdrawSignupRequestMutationData, WithdrawSignupRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<WithdrawSignupRequestMutationData, WithdrawSignupRequestMutationVariables>(WithdrawSignupRequestDocument, options);
      }
export type WithdrawSignupRequestMutationHookResult = ReturnType<typeof useWithdrawSignupRequestMutation>;
export type WithdrawSignupRequestMutationResult = Apollo.MutationResult<WithdrawSignupRequestMutationData>;
export type WithdrawSignupRequestMutationOptions = Apollo.BaseMutationOptions<WithdrawSignupRequestMutationData, WithdrawSignupRequestMutationVariables>;
export const CreateSignupRankedChoiceDocument = gql`
    mutation CreateSignupRankedChoice($targetRunId: ID!, $requestedBucketKey: String) {
  createSignupRankedChoice(
    input: {targetRunId: $targetRunId, requested_bucket_key: $requestedBucketKey}
  ) {
    signup_ranked_choice {
      id
      ...MySignupRankedChoiceFields
    }
  }
}
    ${MySignupRankedChoiceFieldsFragmentDoc}`;
export type CreateSignupRankedChoiceMutationFn = Apollo.MutationFunction<CreateSignupRankedChoiceMutationData, CreateSignupRankedChoiceMutationVariables>;

/**
 * __useCreateSignupRankedChoiceMutation__
 *
 * To run a mutation, you first call `useCreateSignupRankedChoiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSignupRankedChoiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSignupRankedChoiceMutation, { data, loading, error }] = useCreateSignupRankedChoiceMutation({
 *   variables: {
 *      targetRunId: // value for 'targetRunId'
 *      requestedBucketKey: // value for 'requestedBucketKey'
 *   },
 * });
 */
export function useCreateSignupRankedChoiceMutation(baseOptions?: Apollo.MutationHookOptions<CreateSignupRankedChoiceMutationData, CreateSignupRankedChoiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSignupRankedChoiceMutationData, CreateSignupRankedChoiceMutationVariables>(CreateSignupRankedChoiceDocument, options);
      }
export type CreateSignupRankedChoiceMutationHookResult = ReturnType<typeof useCreateSignupRankedChoiceMutation>;
export type CreateSignupRankedChoiceMutationResult = Apollo.MutationResult<CreateSignupRankedChoiceMutationData>;
export type CreateSignupRankedChoiceMutationOptions = Apollo.BaseMutationOptions<CreateSignupRankedChoiceMutationData, CreateSignupRankedChoiceMutationVariables>;