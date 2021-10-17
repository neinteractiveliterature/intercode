import { gql } from '@apollo/client';
import { ConventionDisplayFields } from './queries';

export const CreateConvention = gql`
  mutation CreateConvention(
    $convention: ConventionInput!
    $cloneConventionId: ID
    $organizationId: ID
    $cmsContentSetName: String
  ) {
    createConvention(
      input: {
        convention: $convention
        transitionalCloneConventionId: $cloneConventionId
        transitionalOrganizationId: $organizationId
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
  mutation SetConventionCanceled($id: ID!, $canceled: Boolean!) {
    setConventionCanceled(input: { transitionalId: $id, canceled: $canceled }) {
      convention {
        id: transitionalId
        ...ConventionDisplayFields
      }
    }
  }

  ${ConventionDisplayFields}
`;
