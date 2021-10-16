import { gql } from '@apollo/client';

export const CmsPageAdminLayoutFields = gql`
  fragment CmsPageAdminLayoutFields on CmsLayout {
    id
    name
  }
`;

export const CmsPageFields = gql`
  fragment CmsPageFields on Page {
    id
    name
    slug
    content
    admin_notes
    skip_clickwrap_agreement
    hidden_from_search
    current_ability_can_update
    current_ability_can_delete

    cms_layout {
      id
      ...CmsPageAdminLayoutFields
    }
  }

  ${CmsPageAdminLayoutFields}
`;

export const CmsPagesAdminQuery = gql`
  query CmsPagesAdminQuery {
    convention: conventionByRequestHostIfPresent {
      id
      name
    }

    currentAbility {
      can_create_pages
    }

    cmsParent: cmsParentByRequestHost {
      id

      cmsPages {
        id
        ...CmsPageFields
      }

      cmsLayouts {
        id
        ...CmsPageAdminLayoutFields
      }

      ... on RootSite {
        root_site_default_layout: defaultLayout {
          id
          ...CmsPageAdminLayoutFields
        }
      }

      ... on Convention {
        defaultLayout {
          id
          ...CmsPageAdminLayoutFields
        }
      }
    }
  }

  ${CmsPageFields}
  ${CmsPageAdminLayoutFields}
`;
