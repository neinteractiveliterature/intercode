import { gql } from '@apollo/client';
import { PermissionedModelFields, PermissionedRoleFields } from '../Permissions/fragments';

export const StaffPositionFields = gql`
  fragment StaffPositionFields on StaffPosition {
    id
    name
    email
    visible
    email_aliases
    cc_addresses

    user_con_profiles {
      id
      name_without_nickname
      gravatar_url
      gravatar_enabled
    }

    permissions {
      id
      permission

      model {
        ...PermissionedModelFields
      }

      role {
        ...PermissionedRoleFields
      }
    }
  }

  ${PermissionedModelFields}
  ${PermissionedRoleFields}
`;

export const StaffPositionsQuery = gql`
  query StaffPositionsQuery {
    convention: conventionByRequestHost {
      id
      name

      event_categories {
        id
        name
        default_color
      }

      cmsContentGroups {
        id
        name
      }

      staff_positions {
        id
        ...StaffPositionFields
      }
    }
  }

  ${StaffPositionFields}
`;
