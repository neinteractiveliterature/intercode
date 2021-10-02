import { gql } from '@apollo/client';

export const AdminNavigationItemFields = gql`
  fragment AdminNavigationItemFields on CmsNavigationItem {
    id
    position
    title

    page {
      id
    }

    navigation_section {
      id
    }
  }
`;

export const NavigationItemsAdminQuery = gql`
  query NavigationItemsAdminQuery {
    convention: conventionByRequestHostIfPresent {
      id
      name
    }

    cmsParent: cmsParentByRequestHost {
      id

      cmsPages {
        id
        name
      }

      cmsNavigationItems {
        id
        ...AdminNavigationItemFields
      }
    }
  }

  ${AdminNavigationItemFields}
`;
