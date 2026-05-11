/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import * as Types from '../../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type CmsContentGroupInput = {
  contents?: Array<CmsContentInput> | null | undefined;
  name?: string | null | undefined;
};

export type CmsContentInput = {
  content_type: CmsContentTypeIndicator;
  id?: string | number | null | undefined;
};

export type CmsContentTypeIndicator =
  | 'CmsLayout'
  | 'CmsPartial'
  | 'Page';

export type PermissionInput = {
  modelId?: string | number | null | undefined;
  model_type?: PermissionedModelTypeIndicator | null | undefined;
  permission: string;
  roleId?: string | number | null | undefined;
  role_type?: PermissionedRoleTypeIndicator | null | undefined;
};

export type PermissionedModelTypeIndicator =
  | 'CmsContentGroup'
  | 'Convention'
  | 'EventCategory';

export type PermissionedRoleTypeIndicator =
  | 'OrganizationRole'
  | 'StaffPosition';

export type CreateContentGroupMutationVariables = Exact<{
  cmsContentGroup: Types.CmsContentGroupInput;
  permissions?: Array<Types.PermissionInput> | Types.PermissionInput | null | undefined;
}>;


export type CreateContentGroupMutationData = { __typename: 'Mutation', createCmsContentGroup: { __typename: 'CreateCmsContentGroupPayload', cms_content_group: { __typename: 'CmsContentGroup', id: string, name: string, current_ability_can_update: boolean, current_ability_can_delete: boolean, contents: Array<
        | { __typename: 'CmsLayout', id: string, name: string | null }
        | { __typename: 'CmsPartial', id: string, name: string | null }
        | { __typename: 'Page', id: string, name: string | null }
      >, permissions: Array<{ __typename: 'Permission', id: string, permission: string, model:
          | { __typename: 'CmsContentGroup', id: string, name: string }
          | { __typename: 'Convention', id: string, name: string }
          | { __typename: 'EventCategory', id: string, name: string, default_color: string | null }
        , role:
          | { __typename: 'OrganizationRole', id: string, name: string }
          | { __typename: 'StaffPosition', id: string, name: string }
         }> } } };

export type UpdateContentGroupMutationVariables = Exact<{
  id: string | number;
  cmsContentGroup: Types.CmsContentGroupInput;
  grantPermissions?: Array<Types.PermissionInput> | Types.PermissionInput | null | undefined;
  revokePermissions?: Array<Types.PermissionInput> | Types.PermissionInput | null | undefined;
}>;


export type UpdateContentGroupMutationData = { __typename: 'Mutation', updateCmsContentGroup: { __typename: 'UpdateCmsContentGroupPayload', cms_content_group: { __typename: 'CmsContentGroup', id: string, name: string, current_ability_can_update: boolean, current_ability_can_delete: boolean, contents: Array<
        | { __typename: 'CmsLayout', id: string, name: string | null }
        | { __typename: 'CmsPartial', id: string, name: string | null }
        | { __typename: 'Page', id: string, name: string | null }
      >, permissions: Array<{ __typename: 'Permission', id: string, permission: string, model:
          | { __typename: 'CmsContentGroup', id: string, name: string }
          | { __typename: 'Convention', id: string, name: string }
          | { __typename: 'EventCategory', id: string, name: string, default_color: string | null }
        , role:
          | { __typename: 'OrganizationRole', id: string, name: string }
          | { __typename: 'StaffPosition', id: string, name: string }
         }> } } };

export type DeleteContentGroupMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteContentGroupMutationData = { __typename: 'Mutation', deleteCmsContentGroup: { __typename: 'DeleteCmsContentGroupPayload', clientMutationId: string | null } };


export const CreateContentGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateContentGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cmsContentGroup"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CmsContentGroupInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"permissions"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PermissionInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCmsContentGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"cms_content_group"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cmsContentGroup"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"permissions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"permissions"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cms_content_group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CmsContentGroupFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CmsContentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CmsContent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Page"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CmsPartial"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CmsLayout"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PermissionedModelFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PermissionedModel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CmsContentGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Convention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventCategory"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"default_color"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PermissionedRoleFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PermissionedRole"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StaffPosition"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrganizationRole"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CmsContentGroupFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CmsContentGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"current_ability_can_update"}},{"kind":"Field","name":{"kind":"Name","value":"current_ability_can_delete"}},{"kind":"Field","name":{"kind":"Name","value":"contents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CmsContentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"permissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"permission"}},{"kind":"Field","name":{"kind":"Name","value":"model"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PermissionedModelFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PermissionedRoleFields"}}]}}]}}]}}]} as unknown as DocumentNode<CreateContentGroupMutationData, CreateContentGroupMutationVariables>;
export const UpdateContentGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateContentGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cmsContentGroup"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CmsContentGroupInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"grantPermissions"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PermissionInput"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"revokePermissions"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PermissionInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCmsContentGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"cms_content_group"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cmsContentGroup"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"grant_permissions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"grantPermissions"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"revoke_permissions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"revokePermissions"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cms_content_group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CmsContentGroupFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CmsContentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CmsContent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Page"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CmsPartial"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CmsLayout"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PermissionedModelFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PermissionedModel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CmsContentGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Convention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventCategory"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"default_color"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PermissionedRoleFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PermissionedRole"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StaffPosition"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrganizationRole"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CmsContentGroupFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CmsContentGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"current_ability_can_update"}},{"kind":"Field","name":{"kind":"Name","value":"current_ability_can_delete"}},{"kind":"Field","name":{"kind":"Name","value":"contents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CmsContentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"permissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"permission"}},{"kind":"Field","name":{"kind":"Name","value":"model"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PermissionedModelFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PermissionedRoleFields"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateContentGroupMutationData, UpdateContentGroupMutationVariables>;
export const DeleteContentGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteContentGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCmsContentGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clientMutationId"}}]}}]}}]} as unknown as DocumentNode<DeleteContentGroupMutationData, DeleteContentGroupMutationVariables>;