/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { SignupFieldsFragment, UserConProfileSignupsFragmentFragment } from './queries.generated';
import { EventPageRunFieldsFragment } from '../EventPage/queries.generated';
import { RunBasicSignupDataFragment, CommonConventionDataFragment } from '../queries.generated';
import { gql } from '@apollo/client';
import { SignupFieldsFragmentDoc, UserConProfileSignupsFragmentFragmentDoc } from './queries.generated';
import { EventPageRunFieldsFragmentDoc } from '../EventPage/queries.generated';
import { RunBasicSignupDataFragmentDoc, CommonConventionDataFragmentDoc } from '../queries.generated';
import * as Apollo from '@apollo/client';
export type ChangeSignupBucketMutationVariables = Types.Exact<{
  signupId: Types.Scalars['Int'];
  bucketKey: Types.Scalars['String'];
}>;


export type ChangeSignupBucketMutation = (
  { __typename?: 'Mutation' }
  & { updateSignupBucket?: Types.Maybe<(
    { __typename?: 'UpdateSignupBucketPayload' }
    & { signup: (
      { __typename?: 'Signup' }
      & Pick<Types.Signup, 'id'>
      & { run: (
        { __typename?: 'Run' }
        & Pick<Types.Run, 'id'>
        & EventPageRunFieldsFragment
        & RunBasicSignupDataFragment
      ) }
      & SignupFieldsFragment
    ) }
  )> }
);

export type ForceConfirmSignupMutationVariables = Types.Exact<{
  signupId: Types.Scalars['Int'];
  bucketKey: Types.Scalars['String'];
}>;


export type ForceConfirmSignupMutation = (
  { __typename?: 'Mutation' }
  & { forceConfirmSignup?: Types.Maybe<(
    { __typename?: 'ForceConfirmSignupPayload' }
    & { signup: (
      { __typename?: 'Signup' }
      & Pick<Types.Signup, 'id'>
      & { run: (
        { __typename?: 'Run' }
        & Pick<Types.Run, 'id'>
        & EventPageRunFieldsFragment
        & RunBasicSignupDataFragment
      ) }
      & SignupFieldsFragment
    ) }
  )> }
);

export type UpdateSignupCountedMutationVariables = Types.Exact<{
  signupId: Types.Scalars['Int'];
  counted: Types.Scalars['Boolean'];
}>;


export type UpdateSignupCountedMutation = (
  { __typename?: 'Mutation' }
  & { updateSignupCounted?: Types.Maybe<(
    { __typename?: 'UpdateSignupCountedPayload' }
    & { signup: (
      { __typename?: 'Signup' }
      & Pick<Types.Signup, 'id'>
      & { run: (
        { __typename?: 'Run' }
        & Pick<Types.Run, 'id'>
        & EventPageRunFieldsFragment
        & RunBasicSignupDataFragment
      ) }
      & SignupFieldsFragment
    ) }
  )> }
);

export type WithdrawAllUserConProfileSignupsMutationVariables = Types.Exact<{
  userConProfileId: Types.Scalars['Int'];
}>;


export type WithdrawAllUserConProfileSignupsMutation = (
  { __typename?: 'Mutation' }
  & { withdrawAllUserConProfileSignups?: Types.Maybe<(
    { __typename?: 'WithdrawAllUserConProfileSignupsPayload' }
    & { user_con_profile: (
      { __typename?: 'UserConProfile' }
      & Pick<Types.UserConProfile, 'id'>
      & UserConProfileSignupsFragmentFragment
    ) }
  )> }
);


export const ChangeSignupBucketDocument = gql`
    mutation ChangeSignupBucket($signupId: Int!, $bucketKey: String!) {
  updateSignupBucket(input: {id: $signupId, bucket_key: $bucketKey}) {
    signup {
      id
      ...SignupFields
      run {
        id
        ...EventPageRunFields
        ...RunBasicSignupData
      }
    }
  }
}
    ${SignupFieldsFragmentDoc}
${EventPageRunFieldsFragmentDoc}
${RunBasicSignupDataFragmentDoc}`;
export type ChangeSignupBucketMutationFn = Apollo.MutationFunction<ChangeSignupBucketMutation, ChangeSignupBucketMutationVariables>;

/**
 * __useChangeSignupBucketMutation__
 *
 * To run a mutation, you first call `useChangeSignupBucketMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeSignupBucketMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeSignupBucketMutation, { data, loading, error }] = useChangeSignupBucketMutation({
 *   variables: {
 *      signupId: // value for 'signupId'
 *      bucketKey: // value for 'bucketKey'
 *   },
 * });
 */
export function useChangeSignupBucketMutation(baseOptions?: Apollo.MutationHookOptions<ChangeSignupBucketMutation, ChangeSignupBucketMutationVariables>) {
        return Apollo.useMutation<ChangeSignupBucketMutation, ChangeSignupBucketMutationVariables>(ChangeSignupBucketDocument, baseOptions);
      }
export type ChangeSignupBucketMutationHookResult = ReturnType<typeof useChangeSignupBucketMutation>;
export type ChangeSignupBucketMutationResult = Apollo.MutationResult<ChangeSignupBucketMutation>;
export type ChangeSignupBucketMutationOptions = Apollo.BaseMutationOptions<ChangeSignupBucketMutation, ChangeSignupBucketMutationVariables>;
export const ForceConfirmSignupDocument = gql`
    mutation ForceConfirmSignup($signupId: Int!, $bucketKey: String!) {
  forceConfirmSignup(input: {id: $signupId, bucket_key: $bucketKey}) {
    signup {
      id
      ...SignupFields
      run {
        id
        ...EventPageRunFields
        ...RunBasicSignupData
      }
    }
  }
}
    ${SignupFieldsFragmentDoc}
${EventPageRunFieldsFragmentDoc}
${RunBasicSignupDataFragmentDoc}`;
export type ForceConfirmSignupMutationFn = Apollo.MutationFunction<ForceConfirmSignupMutation, ForceConfirmSignupMutationVariables>;

/**
 * __useForceConfirmSignupMutation__
 *
 * To run a mutation, you first call `useForceConfirmSignupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForceConfirmSignupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forceConfirmSignupMutation, { data, loading, error }] = useForceConfirmSignupMutation({
 *   variables: {
 *      signupId: // value for 'signupId'
 *      bucketKey: // value for 'bucketKey'
 *   },
 * });
 */
export function useForceConfirmSignupMutation(baseOptions?: Apollo.MutationHookOptions<ForceConfirmSignupMutation, ForceConfirmSignupMutationVariables>) {
        return Apollo.useMutation<ForceConfirmSignupMutation, ForceConfirmSignupMutationVariables>(ForceConfirmSignupDocument, baseOptions);
      }
export type ForceConfirmSignupMutationHookResult = ReturnType<typeof useForceConfirmSignupMutation>;
export type ForceConfirmSignupMutationResult = Apollo.MutationResult<ForceConfirmSignupMutation>;
export type ForceConfirmSignupMutationOptions = Apollo.BaseMutationOptions<ForceConfirmSignupMutation, ForceConfirmSignupMutationVariables>;
export const UpdateSignupCountedDocument = gql`
    mutation UpdateSignupCounted($signupId: Int!, $counted: Boolean!) {
  updateSignupCounted(input: {id: $signupId, counted: $counted}) {
    signup {
      id
      ...SignupFields
      run {
        id
        ...EventPageRunFields
        ...RunBasicSignupData
      }
    }
  }
}
    ${SignupFieldsFragmentDoc}
${EventPageRunFieldsFragmentDoc}
${RunBasicSignupDataFragmentDoc}`;
export type UpdateSignupCountedMutationFn = Apollo.MutationFunction<UpdateSignupCountedMutation, UpdateSignupCountedMutationVariables>;

/**
 * __useUpdateSignupCountedMutation__
 *
 * To run a mutation, you first call `useUpdateSignupCountedMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSignupCountedMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSignupCountedMutation, { data, loading, error }] = useUpdateSignupCountedMutation({
 *   variables: {
 *      signupId: // value for 'signupId'
 *      counted: // value for 'counted'
 *   },
 * });
 */
export function useUpdateSignupCountedMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSignupCountedMutation, UpdateSignupCountedMutationVariables>) {
        return Apollo.useMutation<UpdateSignupCountedMutation, UpdateSignupCountedMutationVariables>(UpdateSignupCountedDocument, baseOptions);
      }
export type UpdateSignupCountedMutationHookResult = ReturnType<typeof useUpdateSignupCountedMutation>;
export type UpdateSignupCountedMutationResult = Apollo.MutationResult<UpdateSignupCountedMutation>;
export type UpdateSignupCountedMutationOptions = Apollo.BaseMutationOptions<UpdateSignupCountedMutation, UpdateSignupCountedMutationVariables>;
export const WithdrawAllUserConProfileSignupsDocument = gql`
    mutation WithdrawAllUserConProfileSignups($userConProfileId: Int!) {
  withdrawAllUserConProfileSignups(input: {user_con_profile_id: $userConProfileId}) {
    user_con_profile {
      id
      ...UserConProfileSignupsFragment
    }
  }
}
    ${UserConProfileSignupsFragmentFragmentDoc}`;
export type WithdrawAllUserConProfileSignupsMutationFn = Apollo.MutationFunction<WithdrawAllUserConProfileSignupsMutation, WithdrawAllUserConProfileSignupsMutationVariables>;

/**
 * __useWithdrawAllUserConProfileSignupsMutation__
 *
 * To run a mutation, you first call `useWithdrawAllUserConProfileSignupsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useWithdrawAllUserConProfileSignupsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [withdrawAllUserConProfileSignupsMutation, { data, loading, error }] = useWithdrawAllUserConProfileSignupsMutation({
 *   variables: {
 *      userConProfileId: // value for 'userConProfileId'
 *   },
 * });
 */
export function useWithdrawAllUserConProfileSignupsMutation(baseOptions?: Apollo.MutationHookOptions<WithdrawAllUserConProfileSignupsMutation, WithdrawAllUserConProfileSignupsMutationVariables>) {
        return Apollo.useMutation<WithdrawAllUserConProfileSignupsMutation, WithdrawAllUserConProfileSignupsMutationVariables>(WithdrawAllUserConProfileSignupsDocument, baseOptions);
      }
export type WithdrawAllUserConProfileSignupsMutationHookResult = ReturnType<typeof useWithdrawAllUserConProfileSignupsMutation>;
export type WithdrawAllUserConProfileSignupsMutationResult = Apollo.MutationResult<WithdrawAllUserConProfileSignupsMutation>;
export type WithdrawAllUserConProfileSignupsMutationOptions = Apollo.BaseMutationOptions<WithdrawAllUserConProfileSignupsMutation, WithdrawAllUserConProfileSignupsMutationVariables>;