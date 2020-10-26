/* eslint-disable import/prefer-default-export */
import { gql } from '@apollo/client';

export const ClickwrapAgreementQuery = gql`
  query ClickwrapAgreementQuery {
    convention: assertConvention {
      id
      name
      clickwrap_agreement_html
    }

    myProfile {
      id
      accepted_clickwrap_agreement
    }
  }
`;
