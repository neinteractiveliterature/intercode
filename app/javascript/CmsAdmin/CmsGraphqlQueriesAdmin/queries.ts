import { gql } from '@apollo/client';

export const CmsGraphqlQueryFields = gql`
  fragment CmsGraphqlQueryFields on CmsGraphqlQuery {
    id: transitionalId
    identifier
    query
    admin_notes
    current_ability_can_update
    current_ability_can_delete
  }
`;

export const CmsGraphqlQueriesQuery = gql`
  query CmsGraphqlQueriesQuery {
    cmsParent: cmsParentByRequestHost {
      id: transitionalId
      cmsGraphqlQueries {
        id: transitionalId
        ...CmsGraphqlQueryFields
      }
    }

    currentAbility {
      can_create_cms_graphql_queries
    }
  }

  ${CmsGraphqlQueryFields}
`;
