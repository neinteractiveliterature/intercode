import { gql } from '@apollo/client';
import { SignupFields, UserConProfileSignupsFragment } from './queries';
import { EventPageRunFields } from '../EventPage/queries';
import { RunBasicSignupData } from '../queries';

export const ChangeSignupBucket = gql`
  mutation ChangeSignupBucket($signupId: ID!, $bucketKey: String!) {
    updateSignupBucket(input: { id: $signupId, bucket_key: $bucketKey }) {
      signup {
        id
        ...SignupFields

        run {
          id
          ...EventPageRunFields
          ...RunBasicSignupData
        }
      }
    }
  }

  ${SignupFields}
  ${EventPageRunFields}
  ${RunBasicSignupData}
`;

export const ForceConfirmSignup = gql`
  mutation ForceConfirmSignup($signupId: ID!, $bucketKey: String!) {
    forceConfirmSignup(input: { id: $signupId, bucket_key: $bucketKey }) {
      signup {
        id
        ...SignupFields

        run {
          id
          ...EventPageRunFields
          ...RunBasicSignupData
        }
      }
    }
  }

  ${SignupFields}
  ${EventPageRunFields}
  ${RunBasicSignupData}
`;

export const UpdateSignupCounted = gql`
  mutation UpdateSignupCounted($signupId: ID!, $counted: Boolean!) {
    updateSignupCounted(input: { id: $signupId, counted: $counted }) {
      signup {
        id
        ...SignupFields

        run {
          id
          ...EventPageRunFields
          ...RunBasicSignupData
        }
      }
    }
  }

  ${SignupFields}
  ${EventPageRunFields}
  ${RunBasicSignupData}
`;

export const WithdrawAllUserConProfileSignups = gql`
  mutation WithdrawAllUserConProfileSignups($userConProfileId: ID!) {
    withdrawAllUserConProfileSignups(input: { userConProfileId: $userConProfileId }) {
      user_con_profile {
        id

        ...UserConProfileSignupsFragment
      }
    }
  }

  ${UserConProfileSignupsFragment}
`;
