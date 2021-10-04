import { gql } from '@apollo/client';
import { CmsFileFields } from './queries';

export const CreateCmsFile = gql`
  mutation CreateCmsFile($file: Upload!) {
    createCmsFile(input: { file: $file }) {
      cms_file {
        id: transitionalId
        ...CmsFileFields
      }
    }
  }
  ${CmsFileFields}
`;

export const RenameCmsFile = gql`
  mutation RenameCmsFile($id: Int!, $filename: String!) {
    renameCmsFile(input: { id: $id, filename: $filename }) {
      cms_file {
        id: transitionalId
        ...CmsFileFields
      }
    }
  }
  ${CmsFileFields}
`;

export const DeleteCmsFile = gql`
  mutation DeleteCmsFile($id: Int!) {
    deleteCmsFile(input: { id: $id }) {
      clientMutationId
    }
  }
`;
