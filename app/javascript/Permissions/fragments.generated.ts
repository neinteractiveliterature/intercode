/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
export type PermissionedModelFields_CmsContentGroup_Fragment = { __typename: 'CmsContentGroup', id: string, name: string };

export type PermissionedModelFields_Convention_Fragment = { __typename: 'Convention', id: string, name: string };

export type PermissionedModelFields_EventCategory_Fragment = { __typename: 'EventCategory', id: string, name: string, default_color?: string | null | undefined };

export type PermissionedModelFieldsFragment = PermissionedModelFields_CmsContentGroup_Fragment | PermissionedModelFields_Convention_Fragment | PermissionedModelFields_EventCategory_Fragment;

export type PermissionedRoleFields_OrganizationRole_Fragment = { __typename: 'OrganizationRole', id: string, name: string };

export type PermissionedRoleFields_StaffPosition_Fragment = { __typename: 'StaffPosition', id: string, name: string };

export type PermissionedRoleFieldsFragment = PermissionedRoleFields_OrganizationRole_Fragment | PermissionedRoleFields_StaffPosition_Fragment;

export const PermissionedModelFieldsFragmentDoc = gql`
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
export const PermissionedRoleFieldsFragmentDoc = gql`
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