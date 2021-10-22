import { gql } from '@apollo/client';
import { CmsContentGroupFields } from './queries';

export const CreateContentGroup = gql`
  mutation CreateContentGroup($cmsContentGroup: CmsContentGroupInput!, $permissions: [PermissionInput!]) {
    createCmsContentGroup(input: { cms_content_group: $cmsContentGroup, permissions: $permissions }) {
      cms_content_group {
        id
        ...CmsContentGroupFields
      }
    }
  }

  ${CmsContentGroupFields}
`;

export const UpdateContentGroup = gql`
  mutation UpdateContentGroup(
    $id: ID!
    $cmsContentGroup: CmsContentGroupInput!
    $grantPermissions: [PermissionInput!]
    $revokePermissions: [PermissionInput!]
  ) {
    updateCmsContentGroup(
      input: {
        transitionalId: $id
        cms_content_group: $cmsContentGroup
        grant_permissions: $grantPermissions
        revoke_permissions: $revokePermissions
      }
    ) {
      cms_content_group {
        id
        ...CmsContentGroupFields
      }
    }
  }

  ${CmsContentGroupFields}
`;

export const DeleteContentGroup = gql`
  mutation DeleteContentGroup($id: ID!) {
    deleteCmsContentGroup(input: { transitionalId: $id }) {
      clientMutationId
    }
  }
`;
