import { gql } from '@apollo/client';

export const AdminNavigationItemFields = gql`
  fragment AdminNavigationItemFields on CmsNavigationItem {
    id: transitionalId
    position
    title

    page {
      id: transitionalId
    }

    navigation_section {
      id: transitionalId
    }
  }
`;

export const NavigationItemsAdminQuery = gql`
  query NavigationItemsAdminQuery {
    convention: conventionByRequestHostIfPresent {
      id: transitionalId
      name
    }

    cmsParent: cmsParentByRequestHost {
      id: transitionalId

      cmsPages {
        id: transitionalId
        name
      }

      cmsNavigationItems {
        id: transitionalId
        ...AdminNavigationItemFields
      }
    }
  }

  ${AdminNavigationItemFields}
`;
