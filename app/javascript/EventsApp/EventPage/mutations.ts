import gql from 'graphql-tag';
import { MySignupFields, EventPageRunFields, MySignupRequestFields } from './queries';
import { RunBasicSignupData } from '../queries';

export const CreateMySignup = gql`
mutation CreateMySignup($runId: Int!, $requestedBucketKey: String, $noRequestedBucket: Boolean) {
  createMySignup(input: {
    run_id: $runId,
    requested_bucket_key: $requestedBucketKey,
    no_requested_bucket: $noRequestedBucket
  }) {
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
mutation WithdrawMySignup($runId: Int!) {
  withdrawMySignup(input: { run_id: $runId }) {
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
mutation CreateSignupRequest($targetRunId: Int!, $requestedBucketKey: String, $replaceSignupId: Int) {
  createSignupRequest(input: { target_run_id: $targetRunId, requested_bucket_key: $requestedBucketKey, replace_signup_id: $replaceSignupId }) {
    signup_request {
      id
      ...MySignupRequestFields
    }
  }
}

${MySignupRequestFields}
`;

export const WithdrawSignupRequest = gql`
mutation WithdrawSignupRequest($id: Int!) {
  withdrawSignupRequest(input: { id: $id }) {
    signup_request {
      id
      ...MySignupRequestFields
    }
  }
}
${MySignupRequestFields}
`;
