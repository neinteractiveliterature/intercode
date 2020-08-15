import { gql } from '@apollo/client';

export const CmsPageQuery = gql`
  query CmsPageQuery($slug: String, $rootPage: Boolean) {
    convention {
      id
      name
      clickwrap_agreement
    }

    currentAbility {
      can_manage_any_cms_content
    }

    myProfile {
      id
      accepted_clickwrap_agreement
    }

    cmsPage(slug: $slug, rootPage: $rootPage) {
      id
      name
      content_html
      current_ability_can_update
      current_ability_can_delete
      skip_clickwrap_agreement
    }
  }
`;

export const PageAdminDropdownQuery = gql`
  query PageAdminDropdownQuery($id: Int!) {
    cmsParent {
      ... on Convention {
        id

        default_layout {
          id
          name
        }
      }

      ... on RootSite {
        id

        root_site_default_layout: default_layout {
          id
          name
        }
      }
    }

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
  }
`;
