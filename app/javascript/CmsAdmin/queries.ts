/* eslint-disable import/prefer-default-export */
import { gql } from '@apollo/client';

export const CmsAdminBaseQuery = gql`
  query CmsAdminBaseQuery {
    convention {
      id
    }

    currentAbility {
      can_create_cms_navigation_items
    }
  }
`;
