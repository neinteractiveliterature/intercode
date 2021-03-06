import { gql } from '@apollo/client';
import { PermissionedModelFields } from '../Permissions/fragments';

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
    }
  }

  ${PermissionedModelFields}
`;

export const StaffPositionsQuery = gql`
  query StaffPositionsQuery {
    convention: assertConvention {
      id
      name

      event_categories {
        id
        name
        default_color
      }

      cms_content_groups {
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
