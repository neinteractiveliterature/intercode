/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { DetailedUserFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type MergeUsersMutationVariables = Types.Exact<{
  userIds: Array<Types.Scalars['Int']> | Types.Scalars['Int'];
  winningUserId: Types.Scalars['Int'];
  winningUserConProfiles: Array<Types.WinningUserConProfileInput> | Types.WinningUserConProfileInput;
}>;


export type MergeUsersMutationData = { __typename: 'Mutation', mergeUsers?: Types.Maybe<{ __typename: 'MergeUsersPayload', user: { __typename: 'User', id: number, name?: Types.Maybe<string>, first_name?: Types.Maybe<string>, last_name?: Types.Maybe<string>, email?: Types.Maybe<string>, privileges?: Types.Maybe<Array<string>>, user_con_profiles: Array<{ __typename: 'UserConProfile', id: number, email?: Types.Maybe<string>, ticket?: Types.Maybe<{ __typename: 'Ticket', id: number }>, signups: Array<{ __typename: 'Signup', id: number, state: Types.SignupState }>, convention: { __typename: 'Convention', id: number, name: string, domain?: Types.Maybe<string>, starts_at?: Types.Maybe<any>, ticket_name: string, timezone_name?: Types.Maybe<string>, timezone_mode: Types.TimezoneMode }, staff_positions: Array<{ __typename: 'StaffPosition', id: number, name: string }> }> } }> };


export const MergeUsersDocument = gql`
    mutation MergeUsers($userIds: [Int!]!, $winningUserId: Int!, $winningUserConProfiles: [WinningUserConProfileInput!]!) {
  mergeUsers(
    input: {userIds: $userIds, winningUserId: $winningUserId, winningUserConProfiles: $winningUserConProfiles}
  ) {
    user {
      id
      ...DetailedUserFields
    }
  }
}
    ${DetailedUserFieldsFragmentDoc}`;
export type MergeUsersMutationFn = Apollo.MutationFunction<MergeUsersMutationData, MergeUsersMutationVariables>;

/**
 * __useMergeUsersMutation__
 *
 * To run a mutation, you first call `useMergeUsersMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMergeUsersMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [mergeUsersMutation, { data, loading, error }] = useMergeUsersMutation({
 *   variables: {
 *      userIds: // value for 'userIds'
 *      winningUserId: // value for 'winningUserId'
 *      winningUserConProfiles: // value for 'winningUserConProfiles'
 *   },
 * });
 */
export function useMergeUsersMutation(baseOptions?: Apollo.MutationHookOptions<MergeUsersMutationData, MergeUsersMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MergeUsersMutationData, MergeUsersMutationVariables>(MergeUsersDocument, options);
      }
export type MergeUsersMutationHookResult = ReturnType<typeof useMergeUsersMutation>;
export type MergeUsersMutationResult = Apollo.MutationResult<MergeUsersMutationData>;
export type MergeUsersMutationOptions = Apollo.BaseMutationOptions<MergeUsersMutationData, MergeUsersMutationVariables>;