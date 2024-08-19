/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type CreateEmailRouteMutationVariables = Types.Exact<{
  emailRoute: Types.EmailRouteInput;
}>;


export type CreateEmailRouteMutationData = { __typename: 'Mutation', createEmailRoute: { __typename: 'CreateEmailRoutePayload', email_route: { __typename: 'EmailRoute', id: string, receiver_address: string, forward_addresses?: Array<string> | null } } };

export type UpdateEmailRouteMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  emailRoute: Types.EmailRouteInput;
}>;


export type UpdateEmailRouteMutationData = { __typename: 'Mutation', updateEmailRoute: { __typename: 'UpdateEmailRoutePayload', email_route: { __typename: 'EmailRoute', id: string, receiver_address: string, forward_addresses?: Array<string> | null } } };

export type DeleteEmailRouteMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type DeleteEmailRouteMutationData = { __typename: 'Mutation', deleteEmailRoute: { __typename: 'DeleteEmailRoutePayload', clientMutationId?: string | null } };


export const CreateEmailRouteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateEmailRoute"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"emailRoute"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EmailRouteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createEmailRoute"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"email_route"},"value":{"kind":"Variable","name":{"kind":"Name","value":"emailRoute"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email_route"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"EmailRouteFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EmailRouteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EmailRoute"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"receiver_address"}},{"kind":"Field","name":{"kind":"Name","value":"forward_addresses"}}]}}]} as unknown as DocumentNode<CreateEmailRouteMutationData, CreateEmailRouteMutationVariables>;
export const UpdateEmailRouteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateEmailRoute"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"emailRoute"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EmailRouteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateEmailRoute"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"email_route"},"value":{"kind":"Variable","name":{"kind":"Name","value":"emailRoute"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email_route"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"EmailRouteFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EmailRouteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EmailRoute"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"receiver_address"}},{"kind":"Field","name":{"kind":"Name","value":"forward_addresses"}}]}}]} as unknown as DocumentNode<UpdateEmailRouteMutationData, UpdateEmailRouteMutationVariables>;
export const DeleteEmailRouteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteEmailRoute"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteEmailRoute"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clientMutationId"}}]}}]}}]} as unknown as DocumentNode<DeleteEmailRouteMutationData, DeleteEmailRouteMutationVariables>;