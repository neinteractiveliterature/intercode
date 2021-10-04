import { gql } from '@apollo/client';
import { CmsPageFields } from './queries';

export const CreatePage = gql`
  mutation CreatePage($page: PageInput!) {
    createPage(input: { page: $page }) {
      page {
        id: transitionalId
        ...CmsPageFields
      }
    }
  }

  ${CmsPageFields}
`;

export const UpdatePage = gql`
  mutation UpdatePage($id: Int!, $page: PageInput!) {
    updatePage(input: { id: $id, page: $page }) {
      page {
        id: transitionalId
        ...CmsPageFields
      }
    }
  }

  ${CmsPageFields}
`;

export const DeletePage = gql`
  mutation DeletePage($id: Int!) {
    deletePage(input: { id: $id }) {
      clientMutationId
    }
  }
`;
