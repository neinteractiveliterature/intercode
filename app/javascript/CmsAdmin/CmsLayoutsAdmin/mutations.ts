import { gql } from '@apollo/client';
import { CmsLayoutFields } from './queries';

export const CreateLayout = gql`
  mutation CreateLayout($cmsLayout: CmsLayoutInput!) {
    createCmsLayout(input: { cms_layout: $cmsLayout }) {
      cms_layout {
        id
        ...CmsLayoutFields
      }
    }
  }

  ${CmsLayoutFields}
`;

export const UpdateLayout = gql`
  mutation UpdateLayout($id: ID!, $cmsLayout: CmsLayoutInput!) {
    updateCmsLayout(input: { id: $id, cms_layout: $cmsLayout }) {
      cms_layout {
        id
        ...CmsLayoutFields
      }
    }
  }

  ${CmsLayoutFields}
`;

export const DeleteLayout = gql`
  mutation DeleteLayout($id: ID!) {
    deleteCmsLayout(input: { id: $id }) {
      clientMutationId
    }
  }
`;
