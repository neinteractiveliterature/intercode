import { gql } from '@apollo/client';
import { OrganizationRoleFields } from './queries';

export const CreateOrganizationRole = gql`
  mutation CreateOrganizationRole(
    $organizationId: Int!
    $name: String!
    $userIds: [Int!]!
    $permissions: [PermissionInput!]!
  ) {
    createOrganizationRole(
      input: {
        organization_id: $organizationId
        organization_role: { name: $name }
        user_ids: $userIds
        permissions: $permissions
      }
    ) {
      organization_role {
        id: transitionalId
        ...OrganizationRoleFields
      }
    }
  }

  ${OrganizationRoleFields}
`;

export const UpdateOrganizationRole = gql`
  mutation UpdateOrganizationRole(
    $id: Int!
    $name: String
    $addUserIds: [Int!]
    $removeUserIds: [Int!]
    $addPermissions: [PermissionInput!]
    $removePermissionIds: [Int!]
  ) {
    updateOrganizationRole(
      input: {
        id: $id
        organization_role: { name: $name }
        add_user_ids: $addUserIds
        remove_user_ids: $removeUserIds
        add_permissions: $addPermissions
        remove_permission_ids: $removePermissionIds
      }
    ) {
      organization_role {
        id: transitionalId
        ...OrganizationRoleFields
      }
    }
  }

  ${OrganizationRoleFields}
`;

export const DeleteOrganizationRole = gql`
  mutation DeleteOrganizationRole($id: Int!) {
    deleteOrganizationRole(input: { id: $id }) {
      clientMutationId
    }
  }
`;
