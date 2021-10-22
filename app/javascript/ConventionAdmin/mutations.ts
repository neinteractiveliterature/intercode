import { gql } from '@apollo/client';
import { ConventionAdminConventionFields } from './queries';

export const UpdateConvention = gql`
  mutation UpdateConvention($input: UpdateConventionInput!) {
    updateConvention(input: $input) {
      convention {
        id
        ...ConventionAdminConventionFields
      }
    }
  }

  ${ConventionAdminConventionFields}
`;

export const CreateConventionStripeAccount = gql`
  mutation CreateConventionStripeAccount($baseUrl: String!) {
    createConventionStripeAccount(input: {}) {
      stripe_account {
        id
        account_onboarding_link(base_url: $baseUrl)
      }
    }
  }
`;
