/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type CmsPageQueryVariables = Types.Exact<{
  slug?: Types.InputMaybe<Types.Scalars['String']['input']>;
  rootPage?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
}>;


export type CmsPageQueryData = { __typename: 'Query', convention?: { __typename: 'Convention', id: string, name: string, clickwrap_agreement?: string | null, my_profile?: { __typename: 'UserConProfile', id: string, accepted_clickwrap_agreement?: boolean | null } | null } | null, cmsParent: { __typename: 'Convention', id: string, cmsPage: { __typename: 'Page', id: string, name?: string | null, content_html: string, current_ability_can_update: boolean, current_ability_can_delete: boolean, skip_clickwrap_agreement?: boolean | null } } | { __typename: 'RootSite', id: string, cmsPage: { __typename: 'Page', id: string, name?: string | null, content_html: string, current_ability_can_update: boolean, current_ability_can_delete: boolean, skip_clickwrap_agreement?: boolean | null } }, currentAbility: { __typename: 'Ability', can_manage_any_cms_content: boolean } };

export type PageAdminDropdownQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type PageAdminDropdownQueryData = { __typename: 'Query', cmsParent: { __typename: 'Convention', id: string, defaultLayout: { __typename: 'CmsLayout', id: string, name?: string | null }, cmsPage: { __typename: 'Page', id: string, cms_layout?: { __typename: 'CmsLayout', id: string, name?: string | null } | null, referenced_partials: Array<{ __typename: 'CmsPartial', id: string, name?: string | null }> } } | { __typename: 'RootSite', id: string, root_site_default_layout: { __typename: 'CmsLayout', id: string, name?: string | null }, cmsPage: { __typename: 'Page', id: string, cms_layout?: { __typename: 'CmsLayout', id: string, name?: string | null } | null, referenced_partials: Array<{ __typename: 'CmsPartial', id: string, name?: string | null }> } } };


export const CmsPageQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CmsPageQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"rootPage"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"convention"},"name":{"kind":"Name","value":"conventionByRequestHostIfPresent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"clickwrap_agreement"}},{"kind":"Field","name":{"kind":"Name","value":"my_profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"accepted_clickwrap_agreement"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"cmsParent"},"name":{"kind":"Name","value":"cmsParentByRequestHost"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cmsPage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}},{"kind":"Argument","name":{"kind":"Name","value":"rootPage"},"value":{"kind":"Variable","name":{"kind":"Name","value":"rootPage"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"content_html"}},{"kind":"Field","name":{"kind":"Name","value":"current_ability_can_update"}},{"kind":"Field","name":{"kind":"Name","value":"current_ability_can_delete"}},{"kind":"Field","name":{"kind":"Name","value":"skip_clickwrap_agreement"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"currentAbility"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"can_manage_any_cms_content"}}]}}]}}]} as unknown as DocumentNode<CmsPageQueryData, CmsPageQueryVariables>;
export const PageAdminDropdownQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PageAdminDropdownQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"cmsParent"},"name":{"kind":"Name","value":"cmsParentByRequestHost"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cmsPage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cms_layout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"referenced_partials"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Convention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"defaultLayout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RootSite"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"root_site_default_layout"},"name":{"kind":"Name","value":"defaultLayout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<PageAdminDropdownQueryData, PageAdminDropdownQueryVariables>;