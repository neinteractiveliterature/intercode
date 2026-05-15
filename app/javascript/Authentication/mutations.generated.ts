/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import * as Types from '../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type SetupMyProfileMutationVariables = Exact<{ [key: string]: never; }>;


export type SetupMyProfileMutationData = { __typename: 'Mutation', setupMyProfile: { __typename: 'SetupMyProfilePayload', my_profile: { __typename: 'UserConProfile', id: string, needs_update: boolean } } };


export const SetupMyProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetupMyProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setupMyProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"my_profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"needs_update"}}]}}]}}]}}]} as unknown as DocumentNode<SetupMyProfileMutationData, SetupMyProfileMutationVariables>;