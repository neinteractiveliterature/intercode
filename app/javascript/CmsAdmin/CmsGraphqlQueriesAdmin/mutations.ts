import { gql } from '@apollo/client';
import { CmsGraphqlQueryFields } from './queries';

export const CreateCmsGraphqlQuery = gql`
  mutation CreateCmsGraphqlQuery($query: CmsGraphqlQueryInput!) {
    createCmsGraphqlQuery(input: { query: $query }) {
      query {
        id
        ...CmsGraphqlQueryFields
      }
    }
  }

  ${CmsGraphqlQueryFields}
`;

export const UpdateCmsGraphqlQuery = gql`
  mutation UpdateCmsGraphqlQuery($id: ID!, $query: CmsGraphqlQueryInput!) {
    updateCmsGraphqlQuery(input: { id: $id, query: $query }) {
      query {
        id
        ...CmsGraphqlQueryFields
      }
    }
  }

  ${CmsGraphqlQueryFields}
`;

export const DeleteCmsGraphqlQuery = gql`
  mutation DeleteCmsGraphqlQuery($id: ID!) {
    deleteCmsGraphqlQuery(input: { id: $id }) {
      query {
        id
      }
    }
  }
`;
