import { gql } from '@apollo/client';

export const CmsPageAdminLayoutFields = gql`
  fragment CmsPageAdminLayoutFields on CmsLayout {
    id: transitionalId
    name
  }
`;

export const CmsPageFields = gql`
  fragment CmsPageFields on Page {
    id: transitionalId
    name
    slug
    content
    admin_notes
    skip_clickwrap_agreement
    hidden_from_search
    current_ability_can_update
    current_ability_can_delete

    cms_layout {
      id: transitionalId
      ...CmsPageAdminLayoutFields
    }
  }

  ${CmsPageAdminLayoutFields}
`;

export const CmsPagesAdminQuery = gql`
  query CmsPagesAdminQuery {
    convention: conventionByRequestHostIfPresent {
      id: transitionalId
      name
    }

    currentAbility {
      can_create_pages
    }

    cmsParent: cmsParentByRequestHost {
      id: transitionalId

      cmsPages {
        id: transitionalId
        ...CmsPageFields
      }

      cmsLayouts {
        id: transitionalId
        ...CmsPageAdminLayoutFields
      }

      ... on RootSite {
        root_site_default_layout: defaultLayout {
          id: transitionalId
          ...CmsPageAdminLayoutFields
        }
      }

      ... on Convention {
        defaultLayout {
          id: transitionalId
          ...CmsPageAdminLayoutFields
        }
      }
    }
  }

  ${CmsPageFields}
  ${CmsPageAdminLayoutFields}
`;
