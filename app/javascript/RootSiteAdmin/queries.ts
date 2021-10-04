import { gql } from '@apollo/client';

export const PageFields = gql`
  fragment PageFields on Page {
    id: transitionalId
    name
  }
`;

export const RootSiteAdminLayoutFields = gql`
  fragment RootSiteAdminLayoutFields on CmsLayout {
    id: transitionalId
    name
  }
`;

export const RootSiteFields = gql`
  fragment RootSiteFields on RootSite {
    id: transitionalId
    site_name

    rootPage {
      id: transitionalId
      ...PageFields
    }

    defaultLayout {
      id: transitionalId
      ...RootSiteAdminLayoutFields
    }

    cmsPages {
      id: transitionalId
      ...PageFields
    }

    cmsLayouts {
      id: transitionalId
      ...RootSiteAdminLayoutFields
    }
  }

  ${PageFields}
  ${RootSiteAdminLayoutFields}
`;

export const RootSiteAdminQuery = gql`
  query RootSiteAdminQuery {
    rootSite {
      id: transitionalId
      ...RootSiteFields
    }
  }

  ${RootSiteFields}
`;
