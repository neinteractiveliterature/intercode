import { gql } from '@apollo/client';

export const PermissionedModelFields = gql`
  fragment PermissionedModelFields on PermissionedModel {
    # eslint-disable-next-line @graphql-eslint/naming-convention
    __typename

    ... on CmsContentGroup {
      id: transitionalId
      name
    }

    ... on Convention {
      id: transitionalId
      name
    }

    ... on EventCategory {
      id: transitionalId
      name
      default_color
    }
  }
`;

export const PermissionedRoleFields = gql`
  fragment PermissionedRoleFields on PermissionedRole {
    # eslint-disable-next-line @graphql-eslint/naming-convention
    __typename

    ... on StaffPosition {
      id: transitionalId
      name
    }

    ... on OrganizationRole {
      id: transitionalId
      name
    }
  }
`;
