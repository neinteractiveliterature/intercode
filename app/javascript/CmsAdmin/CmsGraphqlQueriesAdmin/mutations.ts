import { gql } from '@apollo/client';
import { CmsGraphqlQueryFields } from './queries';

export const CreateCmsGraphqlQuery = gql`
  mutation CreateCmsGraphqlQuery($query: CmsGraphqlQueryInput!) {
    createCmsGraphqlQuery(input: { query: $query }) {
      query {
        id: transitionalId
        ...CmsGraphqlQueryFields
      }
    }
  }

  ${CmsGraphqlQueryFields}
`;

export const UpdateCmsGraphqlQuery = gql`
  mutation UpdateCmsGraphqlQuery($id: Int!, $query: CmsGraphqlQueryInput!) {
    updateCmsGraphqlQuery(input: { id: $id, query: $query }) {
      query {
        id: transitionalId
        ...CmsGraphqlQueryFields
      }
    }
  }

  ${CmsGraphqlQueryFields}
`;

export const DeleteCmsGraphqlQuery = gql`
  mutation DeleteCmsGraphqlQuery($id: Int!) {
    deleteCmsGraphqlQuery(input: { id: $id }) {
      query {
        id: transitionalId
      }
    }
  }
`;
