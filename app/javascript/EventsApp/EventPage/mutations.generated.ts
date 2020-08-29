/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { MySignupFieldsFragment, EventPageRunFieldsFragment, MySignupRequestFieldsFragment } from './queries.generated';
import { RunBasicSignupDataFragment, CommonConventionDataFragment } from '../queries.generated';
import { gql } from '@apollo/client';
import { MySignupFieldsFragmentDoc, EventPageRunFieldsFragmentDoc, MySignupRequestFieldsFragmentDoc } from './queries.generated';
import { RunBasicSignupDataFragmentDoc, CommonConventionDataFragmentDoc } from '../queries.generated';
import * as Apollo from '@apollo/client';
export type CreateMySignupMutationVariables = Types.Exact<{
  runId: Types.Scalars['Int'];
  requestedBucketKey?: Types.Maybe<Types.Scalars['String']>;
  noRequestedBucket?: Types.Maybe<Types.Scalars['Boolean']>;
}>;


export type CreateMySignupMutation = (
  { __typename?: 'Mutation' }
  & { createMySignup?: Types.Maybe<(
    { __typename?: 'CreateMySignupPayload' }
    & { signup: (
      { __typename?: 'Signup' }
      & Pick<Types.Signup, 'id'>
      & { run: (
        { __typename?: 'Run' }
        & Pick<Types.Run, 'id'>
        & EventPageRunFieldsFragment
        & RunBasicSignupDataFragment
      ) }
      & MySignupFieldsFragment
    ) }
  )> }
);

export type WithdrawMySignupMutationVariables = Types.Exact<{
  runId: Types.Scalars['Int'];
}>;


export type WithdrawMySignupMutation = (
  { __typename?: 'Mutation' }
  & { withdrawMySignup?: Types.Maybe<(
    { __typename?: 'WithdrawMySignupPayload' }
    & { signup: (
      { __typename?: 'Signup' }
      & Pick<Types.Signup, 'id'>
      & { run: (
        { __typename?: 'Run' }
        & Pick<Types.Run, 'id'>
        & EventPageRunFieldsFragment
        & RunBasicSignupDataFragment
      ) }
      & MySignupFieldsFragment
    ) }
  )> }
);

export type CreateSignupRequestMutationVariables = Types.Exact<{
  targetRunId: Types.Scalars['Int'];
  requestedBucketKey?: Types.Maybe<Types.Scalars['String']>;
  replaceSignupId?: Types.Maybe<Types.Scalars['Int']>;
}>;


export type CreateSignupRequestMutation = (
  { __typename?: 'Mutation' }
  & { createSignupRequest?: Types.Maybe<(
    { __typename?: 'CreateSignupRequestPayload' }
    & { signup_request: (
      { __typename?: 'SignupRequest' }
      & Pick<Types.SignupRequest, 'id'>
      & MySignupRequestFieldsFragment
    ) }
  )> }
);

export type WithdrawSignupRequestMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type WithdrawSignupRequestMutation = (
  { __typename?: 'Mutation' }
  & { withdrawSignupRequest?: Types.Maybe<(
    { __typename?: 'WithdrawSignupRequestPayload' }
    & { signup_request: (
      { __typename?: 'SignupRequest' }
      & Pick<Types.SignupRequest, 'id'>
      & MySignupRequestFieldsFragment
    ) }
  )> }
);


export const CreateMySignupDocument = gql`
    mutation CreateMySignup($runId: Int!, $requestedBucketKey: String, $noRequestedBucket: Boolean) {
  createMySignup(input: {run_id: $runId, requested_bucket_key: $requestedBucketKey, no_requested_bucket: $noRequestedBucket}) {
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
export type CreateMySignupMutationFn = Apollo.MutationFunction<CreateMySignupMutation, CreateMySignupMutationVariables>;

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
export function useCreateMySignupMutation(baseOptions?: Apollo.MutationHookOptions<CreateMySignupMutation, CreateMySignupMutationVariables>) {
        return Apollo.useMutation<CreateMySignupMutation, CreateMySignupMutationVariables>(CreateMySignupDocument, baseOptions);
      }
export type CreateMySignupMutationHookResult = ReturnType<typeof useCreateMySignupMutation>;
export type CreateMySignupMutationResult = Apollo.MutationResult<CreateMySignupMutation>;
export type CreateMySignupMutationOptions = Apollo.BaseMutationOptions<CreateMySignupMutation, CreateMySignupMutationVariables>;
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
export type WithdrawMySignupMutationFn = Apollo.MutationFunction<WithdrawMySignupMutation, WithdrawMySignupMutationVariables>;

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
export function useWithdrawMySignupMutation(baseOptions?: Apollo.MutationHookOptions<WithdrawMySignupMutation, WithdrawMySignupMutationVariables>) {
        return Apollo.useMutation<WithdrawMySignupMutation, WithdrawMySignupMutationVariables>(WithdrawMySignupDocument, baseOptions);
      }
export type WithdrawMySignupMutationHookResult = ReturnType<typeof useWithdrawMySignupMutation>;
export type WithdrawMySignupMutationResult = Apollo.MutationResult<WithdrawMySignupMutation>;
export type WithdrawMySignupMutationOptions = Apollo.BaseMutationOptions<WithdrawMySignupMutation, WithdrawMySignupMutationVariables>;
export const CreateSignupRequestDocument = gql`
    mutation CreateSignupRequest($targetRunId: Int!, $requestedBucketKey: String, $replaceSignupId: Int) {
  createSignupRequest(input: {target_run_id: $targetRunId, requested_bucket_key: $requestedBucketKey, replace_signup_id: $replaceSignupId}) {
    signup_request {
      id
      ...MySignupRequestFields
    }
  }
}
    ${MySignupRequestFieldsFragmentDoc}`;
export type CreateSignupRequestMutationFn = Apollo.MutationFunction<CreateSignupRequestMutation, CreateSignupRequestMutationVariables>;

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
export function useCreateSignupRequestMutation(baseOptions?: Apollo.MutationHookOptions<CreateSignupRequestMutation, CreateSignupRequestMutationVariables>) {
        return Apollo.useMutation<CreateSignupRequestMutation, CreateSignupRequestMutationVariables>(CreateSignupRequestDocument, baseOptions);
      }
export type CreateSignupRequestMutationHookResult = ReturnType<typeof useCreateSignupRequestMutation>;
export type CreateSignupRequestMutationResult = Apollo.MutationResult<CreateSignupRequestMutation>;
export type CreateSignupRequestMutationOptions = Apollo.BaseMutationOptions<CreateSignupRequestMutation, CreateSignupRequestMutationVariables>;
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
export type WithdrawSignupRequestMutationFn = Apollo.MutationFunction<WithdrawSignupRequestMutation, WithdrawSignupRequestMutationVariables>;

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
export function useWithdrawSignupRequestMutation(baseOptions?: Apollo.MutationHookOptions<WithdrawSignupRequestMutation, WithdrawSignupRequestMutationVariables>) {
        return Apollo.useMutation<WithdrawSignupRequestMutation, WithdrawSignupRequestMutationVariables>(WithdrawSignupRequestDocument, baseOptions);
      }
export type WithdrawSignupRequestMutationHookResult = ReturnType<typeof useWithdrawSignupRequestMutation>;
export type WithdrawSignupRequestMutationResult = Apollo.MutationResult<WithdrawSignupRequestMutation>;
export type WithdrawSignupRequestMutationOptions = Apollo.BaseMutationOptions<WithdrawSignupRequestMutation, WithdrawSignupRequestMutationVariables>;