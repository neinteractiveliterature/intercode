import { gql } from '@apollo/client';
import { DetailedUserFields } from './queries';

export const MergeUsers = gql`
  mutation MergeUsers($userIds: [ID!]!, $winningUserId: ID!, $winningUserConProfiles: [WinningUserConProfileInput!]!) {
    mergeUsers(
      input: { userIds: $userIds, winningUserId: $winningUserId, winningUserConProfiles: $winningUserConProfiles }
    ) {
      user {
        id
        ...DetailedUserFields
      }
    }
  }

  ${DetailedUserFields}
`;
