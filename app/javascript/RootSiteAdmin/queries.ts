import { gql } from '@apollo/client';

export const PageFields = gql`
  fragment PageFields on Page {
    id
    name
  }
`;

export const RootSiteAdminLayoutFields = gql`
  fragment RootSiteAdminLayoutFields on CmsLayout {
    id
    name
  }
`;

export const RootSiteFields = gql`
  fragment RootSiteFields on RootSite {
    id
    site_name

    root_page {
      id
      ...PageFields
    }

    default_layout {
      id
      ...RootSiteAdminLayoutFields
    }
  }

  ${PageFields}
  ${RootSiteAdminLayoutFields}
`;

export const RootSiteAdminQuery = gql`
  query RootSiteAdminQuery {
    rootSite {
      id
      ...RootSiteFields
    }

    cmsPages {
      id
      ...PageFields
    }

    cmsLayouts {
      id
      ...RootSiteAdminLayoutFields
    }
  }

  ${RootSiteFields}
  ${PageFields}
  ${RootSiteAdminLayoutFields}
`;
