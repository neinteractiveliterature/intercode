import { gql } from '@apollo/client';
import { RootSiteFields } from './queries';

export const UpdateRootSite = gql`
  mutation UpdateRootSite($siteName: String, $defaultLayoutId: Int, $rootPageId: Int) {
    updateRootSite(
      input: {
        root_site: {
          site_name: $siteName
          default_layout_id: $defaultLayoutId
          root_page_id: $rootPageId
        }
      }
    ) {
      root_site {
        id: transitionalId
        ...RootSiteFields
      }
    }
  }

  ${RootSiteFields}
`;
