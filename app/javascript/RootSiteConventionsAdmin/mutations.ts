import { gql } from '@apollo/client';
import { ConventionDisplayFields } from './queries';

export const CreateConvention = gql`
  mutation CreateConvention(
    $convention: ConventionInput!
    $cloneConventionId: Int
    $organizationId: Int
    $cmsContentSetName: String
  ) {
    createConvention(
      input: {
        convention: $convention
        clone_convention_id: $cloneConventionId
        organization_id: $organizationId
        cms_content_set_name: $cmsContentSetName
      }
    ) {
      convention {
        id: transitionalId
        ...ConventionDisplayFields
      }
    }
  }

  ${ConventionDisplayFields}
`;

export const SetConventionCanceled = gql`
  mutation SetConventionCanceled($id: Int!, $canceled: Boolean!) {
    setConventionCanceled(input: { id: $id, canceled: $canceled }) {
      convention {
        id: transitionalId
        ...ConventionDisplayFields
      }
    }
  }

  ${ConventionDisplayFields}
`;
