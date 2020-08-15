/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { DetailedUserFieldsFragment } from './queries.generated';
import { gql } from '@apollo/client';
import { DetailedUserFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';


export type MergeUsersMutationVariables = Types.Exact<{
  userIds: Array<Types.Scalars['Int']>;
  winningUserId: Types.Scalars['Int'];
  winningUserConProfiles: Array<Types.WinningUserConProfileInput>;
}>;


export type MergeUsersMutation = (
  { __typename?: 'Mutation' }
  & { mergeUsers?: Types.Maybe<(
    { __typename?: 'MergeUsersPayload' }
    & { user: (
      { __typename?: 'User' }
      & Pick<Types.User, 'id'>
      & DetailedUserFieldsFragment
    ) }
  )> }
);


export const MergeUsersDocument = gql`
    mutation MergeUsers($userIds: [Int!]!, $winningUserId: Int!, $winningUserConProfiles: [WinningUserConProfileInput!]!) {
  mergeUsers(input: {userIds: $userIds, winningUserId: $winningUserId, winningUserConProfiles: $winningUserConProfiles}) {
    user {
      id
      ...DetailedUserFields
    }
  }
}
    ${DetailedUserFieldsFragmentDoc}`;
export type MergeUsersMutationFn = Apollo.MutationFunction<MergeUsersMutation, MergeUsersMutationVariables>;

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
export function useMergeUsersMutation(baseOptions?: Apollo.MutationHookOptions<MergeUsersMutation, MergeUsersMutationVariables>) {
        return Apollo.useMutation<MergeUsersMutation, MergeUsersMutationVariables>(MergeUsersDocument, baseOptions);
      }
export type MergeUsersMutationHookResult = ReturnType<typeof useMergeUsersMutation>;
export type MergeUsersMutationResult = Apollo.MutationResult<MergeUsersMutation>;
export type MergeUsersMutationOptions = Apollo.BaseMutationOptions<MergeUsersMutation, MergeUsersMutationVariables>;