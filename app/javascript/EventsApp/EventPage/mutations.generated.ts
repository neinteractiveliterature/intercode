/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { MySignupFieldsFragmentDoc, EventPageRunFieldsFragmentDoc, MySignupRequestFieldsFragmentDoc } from './queries.generated';
import { RunBasicSignupDataFragmentDoc } from '../queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CreateMySignupMutationVariables = Types.Exact<{
  runId: Types.Scalars['Int'];
  requestedBucketKey?: Types.Maybe<Types.Scalars['String']>;
  noRequestedBucket?: Types.Maybe<Types.Scalars['Boolean']>;
}>;


export type CreateMySignupMutationData = { __typename: 'Mutation', createMySignup?: Types.Maybe<{ __typename: 'CreateMySignupPayload', signup: { __typename: 'Signup', id: number, state: Types.SignupState, waitlist_position?: Types.Maybe<number>, run: { __typename: 'Run', id: number, title_suffix?: Types.Maybe<string>, starts_at: any, current_ability_can_signup_summary_run: boolean, signup_count_by_state_and_bucket_key_and_counted: any, rooms: Array<{ __typename: 'Room', id: number, name?: Types.Maybe<string> }>, my_signups: Array<{ __typename: 'Signup', id: number, state: Types.SignupState, waitlist_position?: Types.Maybe<number> }>, my_signup_requests: Array<{ __typename: 'SignupRequest', id: number, state: Types.SignupRequestState, requested_bucket_key?: Types.Maybe<string>, target_run: { __typename: 'Run', id: number }, replace_signup?: Types.Maybe<{ __typename: 'Signup', id: number }> }> } } }> };

export type WithdrawMySignupMutationVariables = Types.Exact<{
  runId: Types.Scalars['Int'];
}>;


export type WithdrawMySignupMutationData = { __typename: 'Mutation', withdrawMySignup?: Types.Maybe<{ __typename: 'WithdrawMySignupPayload', signup: { __typename: 'Signup', id: number, state: Types.SignupState, waitlist_position?: Types.Maybe<number>, run: { __typename: 'Run', id: number, title_suffix?: Types.Maybe<string>, starts_at: any, current_ability_can_signup_summary_run: boolean, signup_count_by_state_and_bucket_key_and_counted: any, rooms: Array<{ __typename: 'Room', id: number, name?: Types.Maybe<string> }>, my_signups: Array<{ __typename: 'Signup', id: number, state: Types.SignupState, waitlist_position?: Types.Maybe<number> }>, my_signup_requests: Array<{ __typename: 'SignupRequest', id: number, state: Types.SignupRequestState, requested_bucket_key?: Types.Maybe<string>, target_run: { __typename: 'Run', id: number }, replace_signup?: Types.Maybe<{ __typename: 'Signup', id: number }> }> } } }> };

export type CreateSignupRequestMutationVariables = Types.Exact<{
  targetRunId: Types.Scalars['Int'];
  requestedBucketKey?: Types.Maybe<Types.Scalars['String']>;
  replaceSignupId?: Types.Maybe<Types.Scalars['Int']>;
}>;


export type CreateSignupRequestMutationData = { __typename: 'Mutation', createSignupRequest?: Types.Maybe<{ __typename: 'CreateSignupRequestPayload', signup_request: { __typename: 'SignupRequest', id: number, state: Types.SignupRequestState, requested_bucket_key?: Types.Maybe<string>, target_run: { __typename: 'Run', id: number }, replace_signup?: Types.Maybe<{ __typename: 'Signup', id: number }> } }> };

export type WithdrawSignupRequestMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type WithdrawSignupRequestMutationData = { __typename: 'Mutation', withdrawSignupRequest?: Types.Maybe<{ __typename: 'WithdrawSignupRequestPayload', signup_request: { __typename: 'SignupRequest', id: number, state: Types.SignupRequestState, requested_bucket_key?: Types.Maybe<string>, target_run: { __typename: 'Run', id: number }, replace_signup?: Types.Maybe<{ __typename: 'Signup', id: number }> } }> };


export const CreateMySignupDocument = gql`
    mutation CreateMySignup($runId: Int!, $requestedBucketKey: String, $noRequestedBucket: Boolean) {
  createMySignup(
    input: {run_id: $runId, requested_bucket_key: $requestedBucketKey, no_requested_bucket: $noRequestedBucket}
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
    mutation WithdrawMySignup($runId: Int!) {
  withdrawMySignup(input: {run_id: $runId}) {
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
    mutation CreateSignupRequest($targetRunId: Int!, $requestedBucketKey: String, $replaceSignupId: Int) {
  createSignupRequest(
    input: {target_run_id: $targetRunId, requested_bucket_key: $requestedBucketKey, replace_signup_id: $replaceSignupId}
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
    mutation WithdrawSignupRequest($id: Int!) {
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