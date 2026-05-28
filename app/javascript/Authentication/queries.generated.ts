/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import * as Types from '../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type SignInContextQueryVariables = Exact<{ [key: string]: never; }>;


export type SignInContextQueryData = { __typename: 'Query', signInConvention: { __typename: 'Convention', id: string, name: string } | null, signInOAuthApplication: { __typename: 'AuthorizedApplication', uid: string, name: string, is_intercode_frontend: boolean } | null };

export type AccountFormContentQueryVariables = Exact<{ [key: string]: never; }>;


export type AccountFormContentQueryData = { __typename: 'Query', currentAbility: { __typename: 'Ability', can_create_cms_partials: boolean }, rootSite: { __typename: 'RootSite', id: string, blockPartial: { __typename: 'CmsPartial', id: string, content: string | null, content_html: string, current_ability_can_delete: boolean, current_ability_can_update: boolean } | null } };

export type EditUserQueryVariables = Exact<{ [key: string]: never; }>;


export type EditUserQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, name: string } | null, currentUser: { __typename: 'User', id: string, first_name: string | null, last_name: string | null, email: string | null } | null };


export const SignInContextQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SignInContextQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"signInConvention"},"name":{"kind":"Name","value":"conventionByOauthReturnIfPresent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"signInOAuthApplication"},"name":{"kind":"Name","value":"oauthApplicationByCurrentRequest"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"is_intercode_frontend"}}]}}]}}]} as unknown as DocumentNode<SignInContextQueryData, SignInContextQueryVariables>;
export const AccountFormContentQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AccountFormContentQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentAbility"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"can_create_cms_partials"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rootSite"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"blockPartial"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"ACCOUNT_FORM_TEXT"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"content_html"}},{"kind":"Field","name":{"kind":"Name","value":"current_ability_can_delete"}},{"kind":"Field","name":{"kind":"Name","value":"current_ability_can_update"}}]}}]}}]}}]} as unknown as DocumentNode<AccountFormContentQueryData, AccountFormContentQueryVariables>;
export const EditUserQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EditUserQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"convention"},"name":{"kind":"Name","value":"conventionByRequestHostIfPresent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<EditUserQueryData, EditUserQueryVariables>;