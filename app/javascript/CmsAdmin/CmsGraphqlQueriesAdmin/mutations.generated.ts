/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type CreateCmsGraphqlQueryMutationVariables = Types.Exact<{
  query: Types.CmsGraphqlQueryInput;
}>;


export type CreateCmsGraphqlQueryMutationData = { __typename: 'Mutation', createCmsGraphqlQuery: { __typename: 'CreateCmsGraphqlQueryPayload', query: { __typename: 'CmsGraphqlQuery', id: string, identifier: string, query: string, admin_notes?: string | null, current_ability_can_update: boolean, current_ability_can_delete: boolean } } };

export type UpdateCmsGraphqlQueryMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  query: Types.CmsGraphqlQueryInput;
}>;


export type UpdateCmsGraphqlQueryMutationData = { __typename: 'Mutation', updateCmsGraphqlQuery: { __typename: 'UpdateCmsGraphqlQueryPayload', query: { __typename: 'CmsGraphqlQuery', id: string, identifier: string, query: string, admin_notes?: string | null, current_ability_can_update: boolean, current_ability_can_delete: boolean } } };

export type DeleteCmsGraphqlQueryMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type DeleteCmsGraphqlQueryMutationData = { __typename: 'Mutation', deleteCmsGraphqlQuery: { __typename: 'DeleteCmsGraphqlQueryPayload', query: { __typename: 'CmsGraphqlQuery', id: string } } };


export const CreateCmsGraphqlQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCmsGraphqlQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CmsGraphqlQueryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCmsGraphqlQuery"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"query"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CmsGraphqlQueryFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CmsGraphqlQueryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CmsGraphqlQuery"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"query"}},{"kind":"Field","name":{"kind":"Name","value":"admin_notes"}},{"kind":"Field","name":{"kind":"Name","value":"current_ability_can_update"}},{"kind":"Field","name":{"kind":"Name","value":"current_ability_can_delete"}}]}}]} as unknown as DocumentNode<CreateCmsGraphqlQueryMutationData, CreateCmsGraphqlQueryMutationVariables>;
export const UpdateCmsGraphqlQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCmsGraphqlQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CmsGraphqlQueryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCmsGraphqlQuery"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"query"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CmsGraphqlQueryFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CmsGraphqlQueryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CmsGraphqlQuery"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"query"}},{"kind":"Field","name":{"kind":"Name","value":"admin_notes"}},{"kind":"Field","name":{"kind":"Name","value":"current_ability_can_update"}},{"kind":"Field","name":{"kind":"Name","value":"current_ability_can_delete"}}]}}]} as unknown as DocumentNode<UpdateCmsGraphqlQueryMutationData, UpdateCmsGraphqlQueryMutationVariables>;
export const DeleteCmsGraphqlQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCmsGraphqlQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCmsGraphqlQuery"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"query"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteCmsGraphqlQueryMutationData, DeleteCmsGraphqlQueryMutationVariables>;