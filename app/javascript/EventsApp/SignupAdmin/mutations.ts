import { gql } from '@apollo/client';
import { SignupFields, UserConProfileSignupsFragment } from './queries';
import { EventPageRunFields } from '../EventPage/queries';
import { RunBasicSignupData } from '../queries';

export const ChangeSignupBucket = gql`
  mutation ChangeSignupBucket($signupId: Int!, $bucketKey: String!) {
    updateSignupBucket(input: { id: $signupId, bucket_key: $bucketKey }) {
      signup {
        id: transitionalId
        ...SignupFields

        run {
          id: transitionalId
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
  mutation ForceConfirmSignup($signupId: Int!, $bucketKey: String!) {
    forceConfirmSignup(input: { id: $signupId, bucket_key: $bucketKey }) {
      signup {
        id: transitionalId
        ...SignupFields

        run {
          id: transitionalId
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
  mutation UpdateSignupCounted($signupId: Int!, $counted: Boolean!) {
    updateSignupCounted(input: { id: $signupId, counted: $counted }) {
      signup {
        id: transitionalId
        ...SignupFields

        run {
          id: transitionalId
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
  mutation WithdrawAllUserConProfileSignups($userConProfileId: Int!) {
    withdrawAllUserConProfileSignups(input: { user_con_profile_id: $userConProfileId }) {
      user_con_profile {
        id: transitionalId

        ...UserConProfileSignupsFragment
      }
    }
  }

  ${UserConProfileSignupsFragment}
`;
