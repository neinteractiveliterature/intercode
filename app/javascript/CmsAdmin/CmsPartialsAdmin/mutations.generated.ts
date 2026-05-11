/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import * as Types from '../../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
/** Reserved names for partials that will automatically be shown on certain pages if present */
export type CmsPartialBlockName =
  /**
   * Content shown on top of the "update your account" and "create your account" forms. This is used by the "update your
   * account" pages as a way to clarify that your account is shared between multiple conventions.
   */
  | 'ACCOUNT_FORM_TEXT'
  /** Content shown on top of the "my signup queue" page. */
  | 'MY_SIGNUP_QUEUE_TEXT'
  /** Content shown on top of the convention schedule. */
  | 'PRE_SCHEDULE_TEXT';

export type CmsPartialInput = {
  admin_notes?: string | null | undefined;
  content?: string | null | undefined;
  name?: string | null | undefined;
};

export type CreatePartialMutationVariables = Exact<{
  cmsPartial: Types.CmsPartialInput;
  partialBlockName?: Types.CmsPartialBlockName | null | undefined;
}>;


export type CreatePartialMutationData = { __typename: 'Mutation', createCmsPartial: { __typename: 'CreateCmsPartialPayload', cms_partial: { __typename: 'CmsPartial', id: string, name: string | null, content: string | null, admin_notes: string | null, current_ability_can_update: boolean, current_ability_can_delete: boolean } } };

export type UpdatePartialMutationVariables = Exact<{
  id: string | number;
  cmsPartial: Types.CmsPartialInput;
}>;


export type UpdatePartialMutationData = { __typename: 'Mutation', updateCmsPartial: { __typename: 'UpdateCmsPartialPayload', cms_partial: { __typename: 'CmsPartial', id: string, name: string | null, content: string | null, admin_notes: string | null, current_ability_can_update: boolean, current_ability_can_delete: boolean } } };

export type DeletePartialMutationVariables = Exact<{
  id: string | number;
}>;


export type DeletePartialMutationData = { __typename: 'Mutation', deleteCmsPartial: { __typename: 'DeleteCmsPartialPayload', clientMutationId: string | null } };


export const CreatePartialDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePartial"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cmsPartial"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CmsPartialInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"partialBlockName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CmsPartialBlockName"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCmsPartial"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"cms_partial"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cmsPartial"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"partial_block_name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"partialBlockName"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cms_partial"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CmsPartialFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CmsPartialFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CmsPartial"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"admin_notes"}},{"kind":"Field","name":{"kind":"Name","value":"current_ability_can_update"}},{"kind":"Field","name":{"kind":"Name","value":"current_ability_can_delete"}}]}}]} as unknown as DocumentNode<CreatePartialMutationData, CreatePartialMutationVariables>;
export const UpdatePartialDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePartial"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cmsPartial"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CmsPartialInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCmsPartial"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"cms_partial"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cmsPartial"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cms_partial"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CmsPartialFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CmsPartialFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CmsPartial"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"admin_notes"}},{"kind":"Field","name":{"kind":"Name","value":"current_ability_can_update"}},{"kind":"Field","name":{"kind":"Name","value":"current_ability_can_delete"}}]}}]} as unknown as DocumentNode<UpdatePartialMutationData, UpdatePartialMutationVariables>;
export const DeletePartialDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePartial"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCmsPartial"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clientMutationId"}}]}}]}}]} as unknown as DocumentNode<DeletePartialMutationData, DeletePartialMutationVariables>;