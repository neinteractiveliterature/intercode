/* eslint-disable import/prefer-default-export */
import { gql } from '@apollo/client';

export const AcceptClickwrapAgreement = gql`
  mutation AcceptClickwrapAgreement {
    acceptClickwrapAgreement(input: {}) {
      my_profile {
        id
        accepted_clickwrap_agreement
      }
    }
  }
`;
