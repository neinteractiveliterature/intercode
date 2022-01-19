/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { SignupModerationSignupRequestFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateUserSignupMutationVariables = Types.Exact<{
  runId: Types.Scalars['ID'];
  userConProfileId: Types.Scalars['ID'];
  requestedBucketKey?: Types.InputMaybe<Types.Scalars['String']>;
  noRequestedBucket?: Types.InputMaybe<Types.Scalars['Boolean']>;
}>;


export type CreateUserSignupMutationData = { __typename: 'Mutation', createUserSignup: { __typename: 'CreateUserSignupPayload', clientMutationId?: string | null | undefined } };

export type WithdrawUserSignupMutationVariables = Types.Exact<{
  runId: Types.Scalars['ID'];
  userConProfileId: Types.Scalars['ID'];
}>;


export type WithdrawUserSignupMutationData = { __typename: 'Mutation', withdrawUserSignup: { __typename: 'WithdrawUserSignupPayload', clientMutationId?: string | null | undefined } };

export type AcceptSignupRequestMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type AcceptSignupRequestMutationData = { __typename: 'Mutation', acceptSignupRequest: { __typename: 'AcceptSignupRequestPayload', signup_request: { __typename: 'SignupRequest', id: string, state: Types.SignupRequestState, requested_bucket_key?: string | null | undefined, created_at: string, user_con_profile: { __typename: 'UserConProfile', id: string, name: string, name_inverted: string, gravatar_enabled: boolean, gravatar_url: string }, replace_signup?: { __typename: 'Signup', id: string, run: { __typename: 'Run', id: string, title_suffix?: string | null | undefined, starts_at: string, signup_count_by_state_and_bucket_key_and_counted: string, event: { __typename: 'Event', id: string, title?: string | null | undefined, length_seconds: number } } } | null | undefined, target_run: { __typename: 'Run', id: string, title_suffix?: string | null | undefined, starts_at: string, signup_count_by_state_and_bucket_key_and_counted: string, event: { __typename: 'Event', id: string, title?: string | null | undefined, length_seconds: number, registration_policy?: { __typename: 'RegistrationPolicy', prevent_no_preference_signups: boolean, buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, name?: string | null | undefined, total_slots?: number | null | undefined, slots_limited: boolean, anything: boolean, not_counted: boolean }> } | null | undefined } }, result_signup?: { __typename: 'Signup', id: string, state: Types.SignupState, waitlist_position?: number | null | undefined } | null | undefined } } };

export type RejectSignupRequestMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type RejectSignupRequestMutationData = { __typename: 'Mutation', rejectSignupRequest: { __typename: 'RejectSignupRequestPayload', signup_request: { __typename: 'SignupRequest', id: string, state: Types.SignupRequestState, requested_bucket_key?: string | null | undefined, created_at: string, user_con_profile: { __typename: 'UserConProfile', id: string, name: string, name_inverted: string, gravatar_enabled: boolean, gravatar_url: string }, replace_signup?: { __typename: 'Signup', id: string, run: { __typename: 'Run', id: string, title_suffix?: string | null | undefined, starts_at: string, signup_count_by_state_and_bucket_key_and_counted: string, event: { __typename: 'Event', id: string, title?: string | null | undefined, length_seconds: number } } } | null | undefined, target_run: { __typename: 'Run', id: string, title_suffix?: string | null | undefined, starts_at: string, signup_count_by_state_and_bucket_key_and_counted: string, event: { __typename: 'Event', id: string, title?: string | null | undefined, length_seconds: number, registration_policy?: { __typename: 'RegistrationPolicy', prevent_no_preference_signups: boolean, buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, name?: string | null | undefined, total_slots?: number | null | undefined, slots_limited: boolean, anything: boolean, not_counted: boolean }> } | null | undefined } }, result_signup?: { __typename: 'Signup', id: string, state: Types.SignupState, waitlist_position?: number | null | undefined } | null | undefined } } };


export const CreateUserSignupDocument = gql`
    mutation CreateUserSignup($runId: ID!, $userConProfileId: ID!, $requestedBucketKey: String, $noRequestedBucket: Boolean) {
  createUserSignup(
    input: {runId: $runId, userConProfileId: $userConProfileId, requested_bucket_key: $requestedBucketKey, no_requested_bucket: $noRequestedBucket, suppress_notifications: true}
  ) {
    clientMutationId
  }
}
    `;
export type CreateUserSignupMutationFn = Apollo.MutationFunction<CreateUserSignupMutationData, CreateUserSignupMutationVariables>;

/**
 * __useCreateUserSignupMutation__
 *
 * To run a mutation, you first call `useCreateUserSignupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserSignupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserSignupMutation, { data, loading, error }] = useCreateUserSignupMutation({
 *   variables: {
 *      runId: // value for 'runId'
 *      userConProfileId: // value for 'userConProfileId'
 *      requestedBucketKey: // value for 'requestedBucketKey'
 *      noRequestedBucket: // value for 'noRequestedBucket'
 *   },
 * });
 */
export function useCreateUserSignupMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserSignupMutationData, CreateUserSignupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserSignupMutationData, CreateUserSignupMutationVariables>(CreateUserSignupDocument, options);
      }
export type CreateUserSignupMutationHookResult = ReturnType<typeof useCreateUserSignupMutation>;
export type CreateUserSignupMutationResult = Apollo.MutationResult<CreateUserSignupMutationData>;
export type CreateUserSignupMutationOptions = Apollo.BaseMutationOptions<CreateUserSignupMutationData, CreateUserSignupMutationVariables>;
export const WithdrawUserSignupDocument = gql`
    mutation WithdrawUserSignup($runId: ID!, $userConProfileId: ID!) {
  withdrawUserSignup(
    input: {runId: $runId, userConProfileId: $userConProfileId, suppress_notifications: true}
  ) {
    clientMutationId
  }
}
    `;
export type WithdrawUserSignupMutationFn = Apollo.MutationFunction<WithdrawUserSignupMutationData, WithdrawUserSignupMutationVariables>;

/**
 * __useWithdrawUserSignupMutation__
 *
 * To run a mutation, you first call `useWithdrawUserSignupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useWithdrawUserSignupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [withdrawUserSignupMutation, { data, loading, error }] = useWithdrawUserSignupMutation({
 *   variables: {
 *      runId: // value for 'runId'
 *      userConProfileId: // value for 'userConProfileId'
 *   },
 * });
 */
export function useWithdrawUserSignupMutation(baseOptions?: Apollo.MutationHookOptions<WithdrawUserSignupMutationData, WithdrawUserSignupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<WithdrawUserSignupMutationData, WithdrawUserSignupMutationVariables>(WithdrawUserSignupDocument, options);
      }
export type WithdrawUserSignupMutationHookResult = ReturnType<typeof useWithdrawUserSignupMutation>;
export type WithdrawUserSignupMutationResult = Apollo.MutationResult<WithdrawUserSignupMutationData>;
export type WithdrawUserSignupMutationOptions = Apollo.BaseMutationOptions<WithdrawUserSignupMutationData, WithdrawUserSignupMutationVariables>;
export const AcceptSignupRequestDocument = gql`
    mutation AcceptSignupRequest($id: ID!) {
  acceptSignupRequest(input: {id: $id}) {
    signup_request {
      id
      ...SignupModerationSignupRequestFields
    }
  }
}
    ${SignupModerationSignupRequestFieldsFragmentDoc}`;
export type AcceptSignupRequestMutationFn = Apollo.MutationFunction<AcceptSignupRequestMutationData, AcceptSignupRequestMutationVariables>;

/**
 * __useAcceptSignupRequestMutation__
 *
 * To run a mutation, you first call `useAcceptSignupRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptSignupRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptSignupRequestMutation, { data, loading, error }] = useAcceptSignupRequestMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAcceptSignupRequestMutation(baseOptions?: Apollo.MutationHookOptions<AcceptSignupRequestMutationData, AcceptSignupRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AcceptSignupRequestMutationData, AcceptSignupRequestMutationVariables>(AcceptSignupRequestDocument, options);
      }
export type AcceptSignupRequestMutationHookResult = ReturnType<typeof useAcceptSignupRequestMutation>;
export type AcceptSignupRequestMutationResult = Apollo.MutationResult<AcceptSignupRequestMutationData>;
export type AcceptSignupRequestMutationOptions = Apollo.BaseMutationOptions<AcceptSignupRequestMutationData, AcceptSignupRequestMutationVariables>;
export const RejectSignupRequestDocument = gql`
    mutation RejectSignupRequest($id: ID!) {
  rejectSignupRequest(input: {id: $id}) {
    signup_request {
      id
      ...SignupModerationSignupRequestFields
    }
  }
}
    ${SignupModerationSignupRequestFieldsFragmentDoc}`;
export type RejectSignupRequestMutationFn = Apollo.MutationFunction<RejectSignupRequestMutationData, RejectSignupRequestMutationVariables>;

/**
 * __useRejectSignupRequestMutation__
 *
 * To run a mutation, you first call `useRejectSignupRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRejectSignupRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rejectSignupRequestMutation, { data, loading, error }] = useRejectSignupRequestMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRejectSignupRequestMutation(baseOptions?: Apollo.MutationHookOptions<RejectSignupRequestMutationData, RejectSignupRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RejectSignupRequestMutationData, RejectSignupRequestMutationVariables>(RejectSignupRequestDocument, options);
      }
export type RejectSignupRequestMutationHookResult = ReturnType<typeof useRejectSignupRequestMutation>;
export type RejectSignupRequestMutationResult = Apollo.MutationResult<RejectSignupRequestMutationData>;
export type RejectSignupRequestMutationOptions = Apollo.BaseMutationOptions<RejectSignupRequestMutationData, RejectSignupRequestMutationVariables>;