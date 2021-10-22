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
        organizationId: $organizationId
        organization_role: { name: $name }
        userIds: $userIds
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
        id: $id
        organization_role: { name: $name }
        addUserIds: $addUserIds
        removeUserIds: $removeUserIds
        add_permissions: $addPermissions
        removePermissionIds: $removePermissionIds
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
    deleteOrganizationRole(input: { id: $id }) {
      clientMutationId
    }
  }
`;
