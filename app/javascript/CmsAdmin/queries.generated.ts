/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type CmsAdminBaseQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CmsAdminBaseQueryData = { __typename: 'Query', convention?: { __typename: 'Convention', id: string } | null, currentAbility: { __typename: 'Ability', can_create_cms_navigation_items: boolean } };


export const CmsAdminBaseQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CmsAdminBaseQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"convention"},"name":{"kind":"Name","value":"conventionByRequestHostIfPresent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"currentAbility"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"can_create_cms_navigation_items"}}]}}]}}]} as unknown as DocumentNode<CmsAdminBaseQueryData, CmsAdminBaseQueryVariables>;