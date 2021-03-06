import { gql } from '@apollo/client';
import { StaffPositionFields } from './queries';

export const CreateStaffPosition = gql`
  mutation CreateStaffPosition($input: CreateStaffPositionInput!) {
    createStaffPosition(input: $input) {
      staff_position {
        id
        ...StaffPositionFields
      }
    }
  }

  ${StaffPositionFields}
`;

export const UpdateStaffPosition = gql`
  mutation UpdateStaffPosition($input: UpdateStaffPositionInput!) {
    updateStaffPosition(input: $input) {
      staff_position {
        id
        ...StaffPositionFields
      }
    }
  }

  ${StaffPositionFields}
`;

export const UpdateStaffPositionPermissions = gql`
  mutation UpdateStaffPositionPermissions(
    $staffPositionId: Int!
    $grantPermissions: [PermissionInput!]!
    $revokePermissions: [PermissionInput!]!
  ) {
    updateStaffPositionPermissions(
      input: {
        staff_position_id: $staffPositionId
        grant_permissions: $grantPermissions
        revoke_permissions: $revokePermissions
      }
    ) {
      staff_position {
        id
        ...StaffPositionFields
      }
    }
  }

  ${StaffPositionFields}
`;

export const DeleteStaffPosition = gql`
  mutation DeleteStaffPosition($input: DeleteStaffPositionInput!) {
    deleteStaffPosition(input: $input) {
      staff_position {
        id
      }
    }
  }
`;
