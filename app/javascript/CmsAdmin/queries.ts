import { gql } from '@apollo/client';

export const CmsAdminBaseQuery = gql`
  query CmsAdminBaseQuery {
    convention: conventionByRequestHostIfPresent {
      id: transitionalId
    }

    currentAbility {
      can_create_cms_navigation_items
    }
  }
`;
