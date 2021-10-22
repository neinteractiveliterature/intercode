import { gql } from '@apollo/client';
import { CmsPageFields } from './queries';

export const CreatePage = gql`
  mutation CreatePage($page: PageInput!) {
    createPage(input: { page: $page }) {
      page {
        id
        ...CmsPageFields
      }
    }
  }

  ${CmsPageFields}
`;

export const UpdatePage = gql`
  mutation UpdatePage($id: ID!, $page: PageInput!) {
    updatePage(input: { transitionalId: $id, page: $page }) {
      page {
        id
        ...CmsPageFields
      }
    }
  }

  ${CmsPageFields}
`;

export const DeletePage = gql`
  mutation DeletePage($id: ID!) {
    deletePage(input: { transitionalId: $id }) {
      clientMutationId
    }
  }
`;
