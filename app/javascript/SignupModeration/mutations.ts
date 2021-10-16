import { gql } from '@apollo/client';
import { SignupModerationSignupRequestFields } from './queries';

export const CreateUserSignup = gql`
  mutation CreateUserSignup(
    $runId: Int!
    $userConProfileId: Int!
    $requestedBucketKey: String
    $noRequestedBucket: Boolean
  ) {
    createUserSignup(
      input: {
        run_id: $runId
        user_con_profile_id: $userConProfileId
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
  mutation WithdrawUserSignup($runId: Int!, $userConProfileId: Int!) {
    withdrawUserSignup(
      input: {
        run_id: $runId
        user_con_profile_id: $userConProfileId
        suppress_notifications: true
      }
    ) {
      clientMutationId
    }
  }
`;

export const AcceptSignupRequest = gql`
  mutation AcceptSignupRequest($id: Int!) {
    acceptSignupRequest(input: { id: $id }) {
      signup_request {
        id: transitionalId
        ...SignupModerationSignupRequestFields
      }
    }
  }

  ${SignupModerationSignupRequestFields}
`;

export const RejectSignupRequest = gql`
  mutation RejectSignupRequest($id: Int!) {
    rejectSignupRequest(input: { id: $id }) {
      signup_request {
        id: transitionalId
        ...SignupModerationSignupRequestFields
      }
    }
  }

  ${SignupModerationSignupRequestFields}
`;
