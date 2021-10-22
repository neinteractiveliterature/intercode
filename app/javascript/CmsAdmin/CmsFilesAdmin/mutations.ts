import { gql } from '@apollo/client';
import { CmsFileFields } from './queries';

export const CreateCmsFile = gql`
  mutation CreateCmsFile($file: Upload!) {
    createCmsFile(input: { file: $file }) {
      cms_file {
        id
        ...CmsFileFields
      }
    }
  }
  ${CmsFileFields}
`;

export const RenameCmsFile = gql`
  mutation RenameCmsFile($id: ID!, $filename: String!) {
    renameCmsFile(input: { transitionalId: $id, filename: $filename }) {
      cms_file {
        id
        ...CmsFileFields
      }
    }
  }
  ${CmsFileFields}
`;

export const DeleteCmsFile = gql`
  mutation DeleteCmsFile($id: ID!) {
    deleteCmsFile(input: { transitionalId: $id }) {
      clientMutationId
    }
  }
`;
