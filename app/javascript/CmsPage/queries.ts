import { gql } from '@apollo/client';

export const CmsPageQuery = gql`
  query CmsPageQuery($slug: String, $rootPage: Boolean) {
    convention: conventionByRequestHostIfPresent {
      id
      name
      clickwrap_agreement

      my_profile {
        id
        accepted_clickwrap_agreement
      }
    }

    cmsParent: cmsParentByRequestHost {
      id

      cmsPage(slug: $slug, rootPage: $rootPage) {
        id
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
  query PageAdminDropdownQuery($id: Int!) {
    cmsParent: cmsParentByRequestHost {
      id

      cmsPage(id: $id) {
        id
        cms_layout {
          id
          name
        }

        referenced_partials {
          id
          name
        }
      }

      ... on Convention {
        defaultLayout {
          id
          name
        }
      }

      ... on RootSite {
        root_site_default_layout: defaultLayout {
          id
          name
        }
      }
    }
  }
`;
