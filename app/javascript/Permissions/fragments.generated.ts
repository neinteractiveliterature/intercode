/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type PermissionedModelFields_CmsContentGroup_Fragment = { __typename: 'CmsContentGroup', id: string, name: string };

export type PermissionedModelFields_Convention_Fragment = { __typename: 'Convention', id: string, name: string };

export type PermissionedModelFields_EventCategory_Fragment = { __typename: 'EventCategory', id: string, name: string, default_color?: string | null };

export type PermissionedModelFieldsFragment = PermissionedModelFields_CmsContentGroup_Fragment | PermissionedModelFields_Convention_Fragment | PermissionedModelFields_EventCategory_Fragment;

export type PermissionedRoleFields_OrganizationRole_Fragment = { __typename: 'OrganizationRole', id: string, name: string };

export type PermissionedRoleFields_StaffPosition_Fragment = { __typename: 'StaffPosition', id: string, name: string };

export type PermissionedRoleFieldsFragment = PermissionedRoleFields_OrganizationRole_Fragment | PermissionedRoleFields_StaffPosition_Fragment;

export const PermissionedModelFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PermissionedModelFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PermissionedModel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CmsContentGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Convention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventCategory"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"default_color"}}]}}]}}]} as unknown as DocumentNode<PermissionedModelFieldsFragment, unknown>;
export const PermissionedRoleFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PermissionedRoleFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PermissionedRole"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StaffPosition"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrganizationRole"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<PermissionedRoleFieldsFragment, unknown>;