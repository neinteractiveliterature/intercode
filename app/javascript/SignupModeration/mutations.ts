import { gql } from '@apollo/client';
import { SignupModerationSignupRequestFields } from './queries';

export const CreateUserSignup = gql`
  mutation CreateUserSignup(
    $runId: ID!
    $userConProfileId: ID!
    $requestedBucketKey: String
    $noRequestedBucket: Boolean
  ) {
    createUserSignup(
      input: {
        runId: $runId
        userConProfileId: $userConProfileId
        requested_bucket_key: $requestedBucketKey
        no_requested_bucket: $noRequestedBucket
        suppress_notifications: true
      }
    ) {
      clientMutationId
    }
  }
`;

export const WithdrawUserSignup = gql`
  mutation WithdrawUserSignup($runId: ID!, $userConProfileId: ID!) {
    withdrawUserSignup(input: { runId: $runId, userConProfileId: $userConProfileId, suppress_notifications: true }) {
      clientMutationId
    }
  }
`;

export const AcceptSignupRequest = gql`
  mutation AcceptSignupRequest($id: ID!) {
    acceptSignupRequest(input: { id: $id }) {
      signup_request {
        id
        ...SignupModerationSignupRequestFields
      }
    }
  }

  ${SignupModerationSignupRequestFields}
`;

export const RejectSignupRequest = gql`
  mutation RejectSignupRequest($id: ID!) {
    rejectSignupRequest(input: { id: $id }) {
      signup_request {
        id
        ...SignupModerationSignupRequestFields
      }
    }
  }

  ${SignupModerationSignupRequestFields}
`;
