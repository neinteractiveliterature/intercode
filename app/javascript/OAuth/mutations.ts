/* eslint-disable import/prefer-default-export */
import { gql } from '@apollo/client';

export const RevokeAuthorizedApplication = gql`
  mutation RevokeAuthorizedApplication($uid: ID!) {
    revokeAuthorizedApplication(input: { uid: $uid }) {
      clientMutationId
    }
  }
`;
