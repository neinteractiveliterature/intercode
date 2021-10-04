/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
export type PermissionedModelFields_CmsContentGroup_Fragment = { __typename: 'CmsContentGroup', name: string, id: string };

export type PermissionedModelFields_Convention_Fragment = { __typename: 'Convention', name: string, id: string };

export type PermissionedModelFields_EventCategory_Fragment = { __typename: 'EventCategory', name: string, default_color?: string | null | undefined, id: string };

export type PermissionedModelFieldsFragment = PermissionedModelFields_CmsContentGroup_Fragment | PermissionedModelFields_Convention_Fragment | PermissionedModelFields_EventCategory_Fragment;

export type PermissionedRoleFields_OrganizationRole_Fragment = { __typename: 'OrganizationRole', name: string, id: string };

export type PermissionedRoleFields_StaffPosition_Fragment = { __typename: 'StaffPosition', name: string, id: string };

export type PermissionedRoleFieldsFragment = PermissionedRoleFields_OrganizationRole_Fragment | PermissionedRoleFields_StaffPosition_Fragment;

export const PermissionedModelFieldsFragmentDoc = gql`
    fragment PermissionedModelFields on PermissionedModel {
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
export const PermissionedRoleFieldsFragmentDoc = gql`
    fragment PermissionedRoleFields on PermissionedRole {
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