import { gql } from '@apollo/client';

export const OrganizationRoleFields = gql`
  fragment OrganizationRoleFields on OrganizationRole {
    id
    name

    users {
      id
      name
      email
    }

    permissions {
      id
      permission
    }
  }
`;

export const OrganizationAdminOrganizationsQuery = gql`
  query OrganizationAdminOrganizationsQuery {
    organizations {
      id
      name
      current_ability_can_manage_access

      conventions {
        id
        name
        starts_at
      }

      organization_roles {
        id
        ...OrganizationRoleFields
      }
    }
  }

  ${OrganizationRoleFields}
`;
