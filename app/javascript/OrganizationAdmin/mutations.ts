import { gql } from '@apollo/client';
import { OrganizationRoleFields } from './queries';

export const CreateOrganizationRole = gql`
  mutation CreateOrganizationRole(
    $organizationId: ID!
    $name: String!
    $userIds: [ID!]!
    $permissions: [PermissionInput!]!
  ) {
    createOrganizationRole(
      input: {
        transitionalOrganizationId: $organizationId
        organization_role: { name: $name }
        transitionalUserIds: $userIds
        permissions: $permissions
      }
    ) {
      organization_role {
        id
        ...OrganizationRoleFields
      }
    }
  }

  ${OrganizationRoleFields}
`;

export const UpdateOrganizationRole = gql`
  mutation UpdateOrganizationRole(
    $id: ID!
    $name: String
    $addUserIds: [ID!]
    $removeUserIds: [ID!]
    $addPermissions: [PermissionInput!]
    $removePermissionIds: [ID!]
  ) {
    updateOrganizationRole(
      input: {
        transitionalId: $id
        organization_role: { name: $name }
        transitionalAddUserIds: $addUserIds
        transitionalRemoveUserIds: $removeUserIds
        add_permissions: $addPermissions
        transitionalRemovePermissionIds: $removePermissionIds
      }
    ) {
      organization_role {
        id
        ...OrganizationRoleFields
      }
    }
  }

  ${OrganizationRoleFields}
`;

export const DeleteOrganizationRole = gql`
  mutation DeleteOrganizationRole($id: ID!) {
    deleteOrganizationRole(input: { transitionalId: $id }) {
      clientMutationId
    }
  }
`;
