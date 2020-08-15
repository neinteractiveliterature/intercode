import { gql } from '@apollo/client';
import { ConventionAdminConventionFields } from './queries';

/* eslint-disable import/prefer-default-export */
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
