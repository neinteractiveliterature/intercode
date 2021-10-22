import { gql } from '@apollo/client';
import { RootSiteFields } from './queries';

export const UpdateRootSite = gql`
  mutation UpdateRootSite($siteName: String, $defaultLayoutId: ID, $rootPageId: ID) {
    updateRootSite(
      input: { root_site: { site_name: $siteName, defaultLayoutId: $defaultLayoutId, rootPageId: $rootPageId } }
    ) {
      root_site {
        id
        ...RootSiteFields
      }
    }
  }

  ${RootSiteFields}
`;
