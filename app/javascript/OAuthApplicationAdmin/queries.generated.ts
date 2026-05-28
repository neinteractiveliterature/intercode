/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import * as Types from '../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type OAuthApplicationFieldsFragment = { __typename: 'OAuthApplication', id: string, name: string, uid: string, redirect_uri: string | null, scopes: Array<string>, confidential: boolean, is_intercode_frontend: boolean };

export type OAuthApplicationsQueryVariables = Exact<{ [key: string]: never; }>;


export type OAuthApplicationsQueryData = { __typename: 'Query', oauth_applications: Array<{ __typename: 'OAuthApplication', id: string, name: string, uid: string, redirect_uri: string | null, scopes: Array<string>, confidential: boolean, is_intercode_frontend: boolean }> };

export const OAuthApplicationFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OAuthApplicationFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OAuthApplication"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"redirect_uri"}},{"kind":"Field","name":{"kind":"Name","value":"scopes"}},{"kind":"Field","name":{"kind":"Name","value":"confidential"}},{"kind":"Field","name":{"kind":"Name","value":"is_intercode_frontend"}}]}}]} as unknown as DocumentNode<OAuthApplicationFieldsFragment, unknown>;
export const OAuthApplicationsQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OAuthApplicationsQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"oauth_applications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"OAuthApplicationFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OAuthApplicationFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OAuthApplication"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"redirect_uri"}},{"kind":"Field","name":{"kind":"Name","value":"scopes"}},{"kind":"Field","name":{"kind":"Name","value":"confidential"}},{"kind":"Field","name":{"kind":"Name","value":"is_intercode_frontend"}}]}}]} as unknown as DocumentNode<OAuthApplicationsQueryData, OAuthApplicationsQueryVariables>;