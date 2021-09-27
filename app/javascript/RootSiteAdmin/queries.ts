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

    rootPage {
      id
      ...PageFields
    }

    defaultLayout {
      id
      ...RootSiteAdminLayoutFields
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

  ${PageFields}
  ${RootSiteAdminLayoutFields}
`;

export const RootSiteAdminQuery = gql`
  query RootSiteAdminQuery {
    rootSite {
      id
      ...RootSiteFields
    }
  }

  ${RootSiteFields}
`;
