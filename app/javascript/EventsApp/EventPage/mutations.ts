import { gql } from '@apollo/client';
import { MySignupFields, EventPageRunFields, MySignupRequestFields } from './queries';
import { RunBasicSignupData } from '../queries';

export const CreateMySignup = gql`
  mutation CreateMySignup($runId: ID!, $requestedBucketKey: String, $noRequestedBucket: Boolean) {
    createMySignup(
      input: { runId: $runId, requested_bucket_key: $requestedBucketKey, no_requested_bucket: $noRequestedBucket }
    ) {
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

  ${MySignupFields}
  ${EventPageRunFields}
  ${RunBasicSignupData}
`;

export const WithdrawMySignup = gql`
  mutation WithdrawMySignup($runId: ID!) {
    withdrawMySignup(input: { runId: $runId }) {
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

  ${MySignupFields}
  ${EventPageRunFields}
  ${RunBasicSignupData}
`;

export const CreateSignupRequest = gql`
  mutation CreateSignupRequest($targetRunId: ID!, $requestedBucketKey: String, $replaceSignupId: ID) {
    createSignupRequest(
      input: { targetRunId: $targetRunId, requested_bucket_key: $requestedBucketKey, replaceSignupId: $replaceSignupId }
    ) {
      signup_request {
        id
        ...MySignupRequestFields
      }
    }
  }

  ${MySignupRequestFields}
`;

export const WithdrawSignupRequest = gql`
  mutation WithdrawSignupRequest($id: ID!) {
    withdrawSignupRequest(input: { id: $id }) {
      signup_request {
        id
        ...MySignupRequestFields
      }
    }
  }

  ${MySignupRequestFields}
`;
