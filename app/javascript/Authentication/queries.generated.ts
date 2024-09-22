/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type AccountFormContentQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type AccountFormContentQueryData = { __typename: 'Query', accountFormContentHtml?: string | null };

export type EditUserQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type EditUserQueryData = { __typename: 'Query', convention?: { __typename: 'Convention', id: string, name: string } | null, currentUser?: { __typename: 'User', id: string, first_name?: string | null, last_name?: string | null, email?: string | null } | null };


export const AccountFormContentQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AccountFormContentQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountFormContentHtml"}}]}}]} as unknown as DocumentNode<AccountFormContentQueryData, AccountFormContentQueryVariables>;
export const EditUserQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EditUserQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"convention"},"name":{"kind":"Name","value":"conventionByRequestHostIfPresent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<EditUserQueryData, EditUserQueryVariables>;