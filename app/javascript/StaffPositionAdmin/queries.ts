import { gql } from '@apollo/client';
import { PermissionedModelFields, PermissionedRoleFields } from '../Permissions/fragments';

export const StaffPositionFields = gql`
  fragment StaffPositionFields on StaffPosition {
    id: transitionalId
    name
    email
    visible
    email_aliases
    cc_addresses

    user_con_profiles {
      id: transitionalId
      name_without_nickname
      gravatar_url
      gravatar_enabled
    }

    permissions {
      id: transitionalId
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
      id: transitionalId
      name

      event_categories {
        id: transitionalId
        name
        default_color
      }

      cmsContentGroups {
        id: transitionalId
        name
      }

      staff_positions {
        id: transitionalId
        ...StaffPositionFields
      }
    }
  }

  ${StaffPositionFields}
`;
