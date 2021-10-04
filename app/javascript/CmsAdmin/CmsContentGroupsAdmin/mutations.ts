import { gql } from '@apollo/client';
import { CmsContentGroupFields } from './queries';

export const CreateContentGroup = gql`
  mutation CreateContentGroup(
    $cmsContentGroup: CmsContentGroupInput!
    $permissions: [PermissionInput!]
  ) {
    createCmsContentGroup(
      input: { cms_content_group: $cmsContentGroup, permissions: $permissions }
    ) {
      cms_content_group {
        id: transitionalId
        ...CmsContentGroupFields
      }
    }
  }

  ${CmsContentGroupFields}
`;

export const UpdateContentGroup = gql`
  mutation UpdateContentGroup(
    $id: Int!
    $cmsContentGroup: CmsContentGroupInput!
    $grantPermissions: [PermissionInput!]
    $revokePermissions: [PermissionInput!]
  ) {
    updateCmsContentGroup(
      input: {
        id: $id
        cms_content_group: $cmsContentGroup
        grant_permissions: $grantPermissions
        revoke_permissions: $revokePermissions
      }
    ) {
      cms_content_group {
        id: transitionalId
        ...CmsContentGroupFields
      }
    }
  }

  ${CmsContentGroupFields}
`;

export const DeleteContentGroup = gql`
  mutation DeleteContentGroup($id: Int!) {
    deleteCmsContentGroup(input: { id: $id }) {
      clientMutationId
    }
  }
`;
