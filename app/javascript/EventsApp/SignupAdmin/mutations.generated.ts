/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { SignupFieldsFragmentDoc } from './queries.generated';
import { EventPageRunFieldsFragmentDoc } from '../EventPage/queries.generated';
import { RunBasicSignupDataFragmentDoc } from '../queries.generated';
import { UserConProfileSignupsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type ChangeSignupBucketMutationVariables = Types.Exact<{
  signupId: Types.Scalars['ID'];
  bucketKey: Types.Scalars['String'];
}>;


export type ChangeSignupBucketMutationData = { __typename: 'Mutation', updateSignupBucket: { __typename: 'UpdateSignupBucketPayload', signup: { __typename: 'Signup', state: Types.SignupState, counted: boolean, bucket_key?: string | null | undefined, requested_bucket_key?: string | null | undefined, id: string, run: { __typename: 'Run', title_suffix?: string | null | undefined, starts_at: any, ends_at: any, current_ability_can_signup_summary_run: boolean, signup_count_by_state_and_bucket_key_and_counted: any, id: string, rooms: Array<{ __typename: 'Room', name?: string | null | undefined, id: string }>, event: { __typename: 'Event', title?: string | null | undefined, id: string, event_category: { __typename: 'EventCategory', team_member_name: string, id: string }, registration_policy?: { __typename: 'RegistrationPolicy', buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, name?: string | null | undefined, anything: boolean }> } | null | undefined, team_members: Array<{ __typename: 'TeamMember', id: string, user_con_profile: { __typename: 'UserConProfile', id: string } }> }, my_signups: Array<{ __typename: 'Signup', state: Types.SignupState, waitlist_position?: number | null | undefined, id: string }>, my_signup_requests: Array<{ __typename: 'SignupRequest', state: Types.SignupRequestState, requested_bucket_key?: string | null | undefined, id: string, target_run: { __typename: 'Run', id: string }, replace_signup?: { __typename: 'Signup', id: string } | null | undefined }> }, user_con_profile: { __typename: 'UserConProfile', name_without_nickname: string, nickname?: string | null | undefined, birth_date?: any | null | undefined, email?: string | null | undefined, address?: string | null | undefined, city?: string | null | undefined, state?: string | null | undefined, zipcode?: string | null | undefined, country?: string | null | undefined, mobile_phone?: string | null | undefined, gravatar_enabled: boolean, gravatar_url: string, id: string } } } };

export type ForceConfirmSignupMutationVariables = Types.Exact<{
  signupId: Types.Scalars['ID'];
  bucketKey: Types.Scalars['String'];
}>;


export type ForceConfirmSignupMutationData = { __typename: 'Mutation', forceConfirmSignup: { __typename: 'ForceConfirmSignupPayload', signup: { __typename: 'Signup', state: Types.SignupState, counted: boolean, bucket_key?: string | null | undefined, requested_bucket_key?: string | null | undefined, id: string, run: { __typename: 'Run', title_suffix?: string | null | undefined, starts_at: any, ends_at: any, current_ability_can_signup_summary_run: boolean, signup_count_by_state_and_bucket_key_and_counted: any, id: string, rooms: Array<{ __typename: 'Room', name?: string | null | undefined, id: string }>, event: { __typename: 'Event', title?: string | null | undefined, id: string, event_category: { __typename: 'EventCategory', team_member_name: string, id: string }, registration_policy?: { __typename: 'RegistrationPolicy', buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, name?: string | null | undefined, anything: boolean }> } | null | undefined, team_members: Array<{ __typename: 'TeamMember', id: string, user_con_profile: { __typename: 'UserConProfile', id: string } }> }, my_signups: Array<{ __typename: 'Signup', state: Types.SignupState, waitlist_position?: number | null | undefined, id: string }>, my_signup_requests: Array<{ __typename: 'SignupRequest', state: Types.SignupRequestState, requested_bucket_key?: string | null | undefined, id: string, target_run: { __typename: 'Run', id: string }, replace_signup?: { __typename: 'Signup', id: string } | null | undefined }> }, user_con_profile: { __typename: 'UserConProfile', name_without_nickname: string, nickname?: string | null | undefined, birth_date?: any | null | undefined, email?: string | null | undefined, address?: string | null | undefined, city?: string | null | undefined, state?: string | null | undefined, zipcode?: string | null | undefined, country?: string | null | undefined, mobile_phone?: string | null | undefined, gravatar_enabled: boolean, gravatar_url: string, id: string } } } };

export type UpdateSignupCountedMutationVariables = Types.Exact<{
  signupId: Types.Scalars['ID'];
  counted: Types.Scalars['Boolean'];
}>;


export type UpdateSignupCountedMutationData = { __typename: 'Mutation', updateSignupCounted: { __typename: 'UpdateSignupCountedPayload', signup: { __typename: 'Signup', state: Types.SignupState, counted: boolean, bucket_key?: string | null | undefined, requested_bucket_key?: string | null | undefined, id: string, run: { __typename: 'Run', title_suffix?: string | null | undefined, starts_at: any, ends_at: any, current_ability_can_signup_summary_run: boolean, signup_count_by_state_and_bucket_key_and_counted: any, id: string, rooms: Array<{ __typename: 'Room', name?: string | null | undefined, id: string }>, event: { __typename: 'Event', title?: string | null | undefined, id: string, event_category: { __typename: 'EventCategory', team_member_name: string, id: string }, registration_policy?: { __typename: 'RegistrationPolicy', buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, name?: string | null | undefined, anything: boolean }> } | null | undefined, team_members: Array<{ __typename: 'TeamMember', id: string, user_con_profile: { __typename: 'UserConProfile', id: string } }> }, my_signups: Array<{ __typename: 'Signup', state: Types.SignupState, waitlist_position?: number | null | undefined, id: string }>, my_signup_requests: Array<{ __typename: 'SignupRequest', state: Types.SignupRequestState, requested_bucket_key?: string | null | undefined, id: string, target_run: { __typename: 'Run', id: string }, replace_signup?: { __typename: 'Signup', id: string } | null | undefined }> }, user_con_profile: { __typename: 'UserConProfile', name_without_nickname: string, nickname?: string | null | undefined, birth_date?: any | null | undefined, email?: string | null | undefined, address?: string | null | undefined, city?: string | null | undefined, state?: string | null | undefined, zipcode?: string | null | undefined, country?: string | null | undefined, mobile_phone?: string | null | undefined, gravatar_enabled: boolean, gravatar_url: string, id: string } } } };

export type WithdrawAllUserConProfileSignupsMutationVariables = Types.Exact<{
  userConProfileId: Types.Scalars['ID'];
}>;


export type WithdrawAllUserConProfileSignupsMutationData = { __typename: 'Mutation', withdrawAllUserConProfileSignups: { __typename: 'WithdrawAllUserConProfileSignupsPayload', user_con_profile: { __typename: 'UserConProfile', id: string, signups: Array<{ __typename: 'Signup', state: Types.SignupState, counted: boolean, bucket_key?: string | null | undefined, requested_bucket_key?: string | null | undefined, id: string, user_con_profile: { __typename: 'UserConProfile', id: string }, run: { __typename: 'Run', starts_at: any, id: string, event: { __typename: 'Event', title?: string | null | undefined, length_seconds: number, id: string, event_category: { __typename: 'EventCategory', team_member_name: string, id: string }, registration_policy?: { __typename: 'RegistrationPolicy', buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, name?: string | null | undefined }> } | null | undefined, team_members: Array<{ __typename: 'TeamMember', id: string, user_con_profile: { __typename: 'UserConProfile', id: string } }> }, rooms: Array<{ __typename: 'Room', name?: string | null | undefined, id: string }> } }> } } };


export const ChangeSignupBucketDocument = gql`
    mutation ChangeSignupBucket($signupId: ID!, $bucketKey: String!) {
  updateSignupBucket(input: {transitionalId: $signupId, bucket_key: $bucketKey}) {
    signup {
      id: transitionalId
      ...SignupFields
      run {
        id: transitionalId
        ...EventPageRunFields
        ...RunBasicSignupData
      }
    }
  }
}
    ${SignupFieldsFragmentDoc}
${EventPageRunFieldsFragmentDoc}
${RunBasicSignupDataFragmentDoc}`;
export type ChangeSignupBucketMutationFn = Apollo.MutationFunction<ChangeSignupBucketMutationData, ChangeSignupBucketMutationVariables>;

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
export function useChangeSignupBucketMutation(baseOptions?: Apollo.MutationHookOptions<ChangeSignupBucketMutationData, ChangeSignupBucketMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangeSignupBucketMutationData, ChangeSignupBucketMutationVariables>(ChangeSignupBucketDocument, options);
      }
export type ChangeSignupBucketMutationHookResult = ReturnType<typeof useChangeSignupBucketMutation>;
export type ChangeSignupBucketMutationResult = Apollo.MutationResult<ChangeSignupBucketMutationData>;
export type ChangeSignupBucketMutationOptions = Apollo.BaseMutationOptions<ChangeSignupBucketMutationData, ChangeSignupBucketMutationVariables>;
export const ForceConfirmSignupDocument = gql`
    mutation ForceConfirmSignup($signupId: ID!, $bucketKey: String!) {
  forceConfirmSignup(input: {transitionalId: $signupId, bucket_key: $bucketKey}) {
    signup {
      id: transitionalId
      ...SignupFields
      run {
        id: transitionalId
        ...EventPageRunFields
        ...RunBasicSignupData
      }
    }
  }
}
    ${SignupFieldsFragmentDoc}
${EventPageRunFieldsFragmentDoc}
${RunBasicSignupDataFragmentDoc}`;
export type ForceConfirmSignupMutationFn = Apollo.MutationFunction<ForceConfirmSignupMutationData, ForceConfirmSignupMutationVariables>;

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
export function useForceConfirmSignupMutation(baseOptions?: Apollo.MutationHookOptions<ForceConfirmSignupMutationData, ForceConfirmSignupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ForceConfirmSignupMutationData, ForceConfirmSignupMutationVariables>(ForceConfirmSignupDocument, options);
      }
export type ForceConfirmSignupMutationHookResult = ReturnType<typeof useForceConfirmSignupMutation>;
export type ForceConfirmSignupMutationResult = Apollo.MutationResult<ForceConfirmSignupMutationData>;
export type ForceConfirmSignupMutationOptions = Apollo.BaseMutationOptions<ForceConfirmSignupMutationData, ForceConfirmSignupMutationVariables>;
export const UpdateSignupCountedDocument = gql`
    mutation UpdateSignupCounted($signupId: ID!, $counted: Boolean!) {
  updateSignupCounted(input: {transitionalId: $signupId, counted: $counted}) {
    signup {
      id: transitionalId
      ...SignupFields
      run {
        id: transitionalId
        ...EventPageRunFields
        ...RunBasicSignupData
      }
    }
  }
}
    ${SignupFieldsFragmentDoc}
${EventPageRunFieldsFragmentDoc}
${RunBasicSignupDataFragmentDoc}`;
export type UpdateSignupCountedMutationFn = Apollo.MutationFunction<UpdateSignupCountedMutationData, UpdateSignupCountedMutationVariables>;

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
export function useUpdateSignupCountedMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSignupCountedMutationData, UpdateSignupCountedMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSignupCountedMutationData, UpdateSignupCountedMutationVariables>(UpdateSignupCountedDocument, options);
      }
export type UpdateSignupCountedMutationHookResult = ReturnType<typeof useUpdateSignupCountedMutation>;
export type UpdateSignupCountedMutationResult = Apollo.MutationResult<UpdateSignupCountedMutationData>;
export type UpdateSignupCountedMutationOptions = Apollo.BaseMutationOptions<UpdateSignupCountedMutationData, UpdateSignupCountedMutationVariables>;
export const WithdrawAllUserConProfileSignupsDocument = gql`
    mutation WithdrawAllUserConProfileSignups($userConProfileId: ID!) {
  withdrawAllUserConProfileSignups(
    input: {transitionalUserConProfileId: $userConProfileId}
  ) {
    user_con_profile {
      id: transitionalId
      ...UserConProfileSignupsFragment
    }
  }
}
    ${UserConProfileSignupsFragmentDoc}`;
export type WithdrawAllUserConProfileSignupsMutationFn = Apollo.MutationFunction<WithdrawAllUserConProfileSignupsMutationData, WithdrawAllUserConProfileSignupsMutationVariables>;

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
export function useWithdrawAllUserConProfileSignupsMutation(baseOptions?: Apollo.MutationHookOptions<WithdrawAllUserConProfileSignupsMutationData, WithdrawAllUserConProfileSignupsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<WithdrawAllUserConProfileSignupsMutationData, WithdrawAllUserConProfileSignupsMutationVariables>(WithdrawAllUserConProfileSignupsDocument, options);
      }
export type WithdrawAllUserConProfileSignupsMutationHookResult = ReturnType<typeof useWithdrawAllUserConProfileSignupsMutation>;
export type WithdrawAllUserConProfileSignupsMutationResult = Apollo.MutationResult<WithdrawAllUserConProfileSignupsMutationData>;
export type WithdrawAllUserConProfileSignupsMutationOptions = Apollo.BaseMutationOptions<WithdrawAllUserConProfileSignupsMutationData, WithdrawAllUserConProfileSignupsMutationVariables>;