import { gql } from '@apollo/client';

export const ClickwrapAgreementQuery = gql`
  query ClickwrapAgreementQuery {
    convention: conventionByRequestHost {
      id: transitionalId
      name
      clickwrap_agreement_html

      my_profile {
        id: transitionalId
        accepted_clickwrap_agreement
      }
    }
  }
`;
