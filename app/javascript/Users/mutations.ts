import { gql } from '@apollo/client';
import { DetailedUserFields } from './queries';

export const MergeUsers = gql`
  mutation MergeUsers(
    $userIds: [Int!]!
    $winningUserId: Int!
    $winningUserConProfiles: [WinningUserConProfileInput!]!
  ) {
    mergeUsers(
      input: {
        userIds: $userIds
        winningUserId: $winningUserId
        winningUserConProfiles: $winningUserConProfiles
      }
    ) {
      user {
        id
        ...DetailedUserFields
      }
    }
  }

  ${DetailedUserFields}
`;
