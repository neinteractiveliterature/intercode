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
  mutation UpdatePartial($id: ID!, $cmsPartial: CmsPartialInput!) {
    updateCmsPartial(input: { transitionalId: $id, cms_partial: $cmsPartial }) {
      cms_partial {
        id: transitionalId
        ...CmsPartialFields
      }
    }
  }

  ${CmsPartialFields}
`;

export const DeletePartial = gql`
  mutation DeletePartial($id: ID!) {
    deleteCmsPartial(input: { transitionalId: $id }) {
      clientMutationId
    }
  }
`;
