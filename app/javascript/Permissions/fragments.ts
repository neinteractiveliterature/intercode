import { gql } from '@apollo/client';

export const PermissionedModelFields = gql`
  fragment PermissionedModelFields on PermissionedModel {
    __typename

    ... on CmsContentGroup {
      id
      name
    }

    ... on Convention {
      id
      name
    }

    ... on EventCategory {
      id
      name
      default_color
    }
  }
`;

export const PermissionedRoleFields = gql`
  fragment PermissionedRoleFields on PermissionedRole {
    __typename

    ... on StaffPosition {
      id
      name
    }

    ... on OrganizationRole {
      id
      name
    }
  }
`;
