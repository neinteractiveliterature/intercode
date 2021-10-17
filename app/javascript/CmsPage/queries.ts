import { gql } from '@apollo/client';

export const CmsPageQuery = gql`
  query CmsPageQuery($slug: String, $rootPage: Boolean) {
    convention: conventionByRequestHostIfPresent {
      id: transitionalId
      name
      clickwrap_agreement

      my_profile {
        id: transitionalId
        accepted_clickwrap_agreement
      }
    }

    cmsParent: cmsParentByRequestHost {
      id: transitionalId

      cmsPage(slug: $slug, rootPage: $rootPage) {
        id: transitionalId
        name
        content_html
        current_ability_can_update
        current_ability_can_delete
        skip_clickwrap_agreement
      }
    }

    currentAbility {
      can_manage_any_cms_content
    }
  }
`;

export const PageAdminDropdownQuery = gql`
  query PageAdminDropdownQuery($id: ID!) {
    cmsParent: cmsParentByRequestHost {
      id: transitionalId

      cmsPage(transitionalId: $id) {
        id: transitionalId
        cms_layout {
          id: transitionalId
          name
        }

        referenced_partials {
          id: transitionalId
          name
        }
      }

      ... on Convention {
        defaultLayout {
          id: transitionalId
          name
        }
      }

      ... on RootSite {
        root_site_default_layout: defaultLayout {
          id: transitionalId
          name
        }
      }
    }
  }
`;
