import { gql } from '@apollo/client';

export const OrganizationRoleFields = gql`
  fragment OrganizationRoleFields on OrganizationRole {
    id: transitionalId
    name

    users {
      id: transitionalId
      name
      email
    }

    permissions {
      id: transitionalId
      permission
    }
  }
`;

export const OrganizationAdminOrganizationsQuery = gql`
  query OrganizationAdminOrganizationsQuery {
    organizations {
      id: transitionalId
      name
      current_ability_can_manage_access

      conventions {
        id: transitionalId
        name
        starts_at
      }

      organization_roles {
        id: transitionalId
        ...OrganizationRoleFields
      }
    }
  }

  ${OrganizationRoleFields}
`;
