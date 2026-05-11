/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import * as Types from '../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type OAuthAuthorizationPromptQueryVariables = Exact<{
  queryParams: string;
}>;


export type OAuthAuthorizationPromptQueryData = { __typename: 'Query', oauthPreAuth: string, currentUser: { __typename: 'User', id: string } | null };

export type OAuthAuthorizedApplicationsQueryVariables = Exact<{ [key: string]: never; }>;


export type OAuthAuthorizedApplicationsQueryData = { __typename: 'Query', myAuthorizedApplications: Array<{ __typename: 'AuthorizedApplication', uid: string, name: string, scopes: Array<string> }> };


export const OAuthAuthorizationPromptQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OAuthAuthorizationPromptQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"queryParams"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Json"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"oauthPreAuth"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"queryParams"},"value":{"kind":"Variable","name":{"kind":"Name","value":"queryParams"}}}]}]}}]} as unknown as DocumentNode<OAuthAuthorizationPromptQueryData, OAuthAuthorizationPromptQueryVariables>;
export const OAuthAuthorizedApplicationsQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OAuthAuthorizedApplicationsQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myAuthorizedApplications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"scopes"}}]}}]}}]} as unknown as DocumentNode<OAuthAuthorizedApplicationsQueryData, OAuthAuthorizedApplicationsQueryVariables>;