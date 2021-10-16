import { gql } from '@apollo/client';

export const SiteSearchQuery = gql`
  query SiteSearchQuery($query: String!) {
    cmsParent: cmsParentByRequestHost {
      id

      fullTextSearch(query: $query) {
        total_entries
        entries {
          title
          highlight

          model {
            __typename

            ... on Page {
              id
              slug
            }

            ... on Event {
              id
              title
            }

            ... on EventProposal {
              id
              title
            }

            ... on UserConProfile {
              id
            }
          }
        }
      }
    }
  }
`;
