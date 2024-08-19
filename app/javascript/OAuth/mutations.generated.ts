/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type RevokeAuthorizedApplicationMutationVariables = Types.Exact<{
  uid: Types.Scalars['ID']['input'];
}>;


export type RevokeAuthorizedApplicationMutationData = { __typename: 'Mutation', revokeAuthorizedApplication: { __typename: 'RevokeAuthorizedApplicationPayload', clientMutationId?: string | null } };


export const RevokeAuthorizedApplicationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RevokeAuthorizedApplication"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"revokeAuthorizedApplication"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clientMutationId"}}]}}]}}]} as unknown as DocumentNode<RevokeAuthorizedApplicationMutationData, RevokeAuthorizedApplicationMutationVariables>;