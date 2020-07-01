/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { MySignupFieldsFragment, EventPageRunFieldsFragment, MySignupRequestFieldsFragment } from './queries.generated';
import { RunBasicSignupDataFragment, CommonConventionDataFragment } from '../queries.generated';
import gql from 'graphql-tag';
import { MySignupFieldsFragmentDoc, EventPageRunFieldsFragmentDoc, MySignupRequestFieldsFragmentDoc } from './queries.generated';
import { RunBasicSignupDataFragmentDoc, CommonConventionDataFragmentDoc } from '../queries.generated';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };


export type CreateMySignupMutationVariables = Exact<{
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

export type WithdrawMySignupMutationVariables = Exact<{
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

export type CreateSignupRequestMutationVariables = Exact<{
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

export type WithdrawSignupRequestMutationVariables = Exact<{
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
export type CreateMySignupMutationFn = ApolloReactCommon.MutationFunction<CreateMySignupMutation, CreateMySignupMutationVariables>;

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
export function useCreateMySignupMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateMySignupMutation, CreateMySignupMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateMySignupMutation, CreateMySignupMutationVariables>(CreateMySignupDocument, baseOptions);
      }
export type CreateMySignupMutationHookResult = ReturnType<typeof useCreateMySignupMutation>;
export type CreateMySignupMutationResult = ApolloReactCommon.MutationResult<CreateMySignupMutation>;
export type CreateMySignupMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateMySignupMutation, CreateMySignupMutationVariables>;
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
export type WithdrawMySignupMutationFn = ApolloReactCommon.MutationFunction<WithdrawMySignupMutation, WithdrawMySignupMutationVariables>;

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
export function useWithdrawMySignupMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<WithdrawMySignupMutation, WithdrawMySignupMutationVariables>) {
        return ApolloReactHooks.useMutation<WithdrawMySignupMutation, WithdrawMySignupMutationVariables>(WithdrawMySignupDocument, baseOptions);
      }
export type WithdrawMySignupMutationHookResult = ReturnType<typeof useWithdrawMySignupMutation>;
export type WithdrawMySignupMutationResult = ApolloReactCommon.MutationResult<WithdrawMySignupMutation>;
export type WithdrawMySignupMutationOptions = ApolloReactCommon.BaseMutationOptions<WithdrawMySignupMutation, WithdrawMySignupMutationVariables>;
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
export type CreateSignupRequestMutationFn = ApolloReactCommon.MutationFunction<CreateSignupRequestMutation, CreateSignupRequestMutationVariables>;

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
export function useCreateSignupRequestMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateSignupRequestMutation, CreateSignupRequestMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateSignupRequestMutation, CreateSignupRequestMutationVariables>(CreateSignupRequestDocument, baseOptions);
      }
export type CreateSignupRequestMutationHookResult = ReturnType<typeof useCreateSignupRequestMutation>;
export type CreateSignupRequestMutationResult = ApolloReactCommon.MutationResult<CreateSignupRequestMutation>;
export type CreateSignupRequestMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateSignupRequestMutation, CreateSignupRequestMutationVariables>;
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
export type WithdrawSignupRequestMutationFn = ApolloReactCommon.MutationFunction<WithdrawSignupRequestMutation, WithdrawSignupRequestMutationVariables>;

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
export function useWithdrawSignupRequestMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<WithdrawSignupRequestMutation, WithdrawSignupRequestMutationVariables>) {
        return ApolloReactHooks.useMutation<WithdrawSignupRequestMutation, WithdrawSignupRequestMutationVariables>(WithdrawSignupRequestDocument, baseOptions);
      }
export type WithdrawSignupRequestMutationHookResult = ReturnType<typeof useWithdrawSignupRequestMutation>;
export type WithdrawSignupRequestMutationResult = ApolloReactCommon.MutationResult<WithdrawSignupRequestMutation>;
export type WithdrawSignupRequestMutationOptions = ApolloReactCommon.BaseMutationOptions<WithdrawSignupRequestMutation, WithdrawSignupRequestMutationVariables>;