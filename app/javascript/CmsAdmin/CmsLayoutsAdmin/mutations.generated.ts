/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import * as Types from '../../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type CmsLayoutInput = {
  admin_notes?: string | null | undefined;
  content?: string | null | undefined;
  name?: string | null | undefined;
  navbar_classes?: string | null | undefined;
};

export type CreateLayoutMutationVariables = Exact<{
  cmsLayout: Types.CmsLayoutInput;
}>;


export type CreateLayoutMutationData = { __typename: 'Mutation', createCmsLayout: { __typename: 'CreateCmsLayoutPayload', cms_layout: { __typename: 'CmsLayout', id: string, name: string | null, content: string | null, navbar_classes: string | null, admin_notes: string | null, current_ability_can_update: boolean, current_ability_can_delete: boolean } } };

export type UpdateLayoutMutationVariables = Exact<{
  id: string | number;
  cmsLayout: Types.CmsLayoutInput;
}>;


export type UpdateLayoutMutationData = { __typename: 'Mutation', updateCmsLayout: { __typename: 'UpdateCmsLayoutPayload', cms_layout: { __typename: 'CmsLayout', id: string, name: string | null, content: string | null, navbar_classes: string | null, admin_notes: string | null, current_ability_can_update: boolean, current_ability_can_delete: boolean } } };

export type DeleteLayoutMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteLayoutMutationData = { __typename: 'Mutation', deleteCmsLayout: { __typename: 'DeleteCmsLayoutPayload', clientMutationId: string | null } };


export const CreateLayoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateLayout"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cmsLayout"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CmsLayoutInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCmsLayout"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"cms_layout"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cmsLayout"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cms_layout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CmsLayoutFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CmsLayoutFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CmsLayout"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"navbar_classes"}},{"kind":"Field","name":{"kind":"Name","value":"admin_notes"}},{"kind":"Field","name":{"kind":"Name","value":"current_ability_can_update"}},{"kind":"Field","name":{"kind":"Name","value":"current_ability_can_delete"}}]}}]} as unknown as DocumentNode<CreateLayoutMutationData, CreateLayoutMutationVariables>;
export const UpdateLayoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateLayout"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cmsLayout"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CmsLayoutInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCmsLayout"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"cms_layout"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cmsLayout"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cms_layout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CmsLayoutFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CmsLayoutFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CmsLayout"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"navbar_classes"}},{"kind":"Field","name":{"kind":"Name","value":"admin_notes"}},{"kind":"Field","name":{"kind":"Name","value":"current_ability_can_update"}},{"kind":"Field","name":{"kind":"Name","value":"current_ability_can_delete"}}]}}]} as unknown as DocumentNode<UpdateLayoutMutationData, UpdateLayoutMutationVariables>;
export const DeleteLayoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteLayout"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCmsLayout"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clientMutationId"}}]}}]}}]} as unknown as DocumentNode<DeleteLayoutMutationData, DeleteLayoutMutationVariables>;