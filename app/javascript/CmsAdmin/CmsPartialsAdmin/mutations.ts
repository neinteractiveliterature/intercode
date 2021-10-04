import { gql } from '@apollo/client';
import { CmsPartialFields } from './queries';

export const CreatePartial = gql`
  mutation CreatePartial($cmsPartial: CmsPartialInput!) {
    createCmsPartial(input: { cms_partial: $cmsPartial }) {
      cms_partial {
        id: transitionalId
        ...CmsPartialFields
      }
    }
  }

  ${CmsPartialFields}
`;

export const UpdatePartial = gql`
  mutation UpdatePartial($id: Int!, $cmsPartial: CmsPartialInput!) {
    updateCmsPartial(input: { id: $id, cms_partial: $cmsPartial }) {
      cms_partial {
        id: transitionalId
        ...CmsPartialFields
      }
    }
  }

  ${CmsPartialFields}
`;

export const DeletePartial = gql`
  mutation DeletePartial($id: Int!) {
    deleteCmsPartial(input: { id: $id }) {
      clientMutationId
    }
  }
`;
