import { gql } from '@apollo/client';

export const SiteSearchQuery = gql`
  query SiteSearchQuery($query: String!) {
    cmsParent: cmsParentByRequestHost {
      id: transitionalId

      fullTextSearch(query: $query) {
        total_entries
        entries {
          title
          highlight

          model {
            # eslint-disable-next-line @graphql-eslint/naming-convention
            __typename

            ... on Page {
              id: transitionalId
              slug
            }

            ... on Event {
              id: transitionalId
              title
            }

            ... on EventProposal {
              id: transitionalId
              title
            }

            ... on UserConProfile {
              id: transitionalId
            }
          }
        }
      }
    }
  }
`;
