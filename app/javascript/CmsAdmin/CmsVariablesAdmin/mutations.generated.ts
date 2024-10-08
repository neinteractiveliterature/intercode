/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type SetCmsVariableMutationVariables = Types.Exact<{
  key: Types.Scalars['String']['input'];
  value_json: Types.Scalars['String']['input'];
}>;


export type SetCmsVariableMutationData = { __typename: 'Mutation', setCmsVariable: { __typename: 'SetCmsVariablePayload', cms_variable: { __typename: 'CmsVariable', id: string, key: string, value_json: string, current_ability_can_update: boolean, current_ability_can_delete: boolean } } };

export type DeleteCmsVariableMutationVariables = Types.Exact<{
  key: Types.Scalars['String']['input'];
}>;


export type DeleteCmsVariableMutationData = { __typename: 'Mutation', deleteCmsVariable: { __typename: 'DeleteCmsVariablePayload', cms_variable: { __typename: 'CmsVariable', id: string } } };


export const SetCmsVariableMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetCmsVariableMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"value_json"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setCmsVariable"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"cms_variable"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"value_json"},"value":{"kind":"Variable","name":{"kind":"Name","value":"value_json"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cms_variable"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CmsVariableFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CmsVariableFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CmsVariable"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value_json"}},{"kind":"Field","name":{"kind":"Name","value":"current_ability_can_update"}},{"kind":"Field","name":{"kind":"Name","value":"current_ability_can_delete"}}]}}]} as unknown as DocumentNode<SetCmsVariableMutationData, SetCmsVariableMutationVariables>;
export const DeleteCmsVariableMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCmsVariableMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCmsVariable"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cms_variable"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteCmsVariableMutationData, DeleteCmsVariableMutationVariables>;