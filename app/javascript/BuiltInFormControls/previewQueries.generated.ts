/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type PreviewLiquidQueryVariables = Types.Exact<{
  liquid: Types.Scalars['String']['input'];
}>;


export type PreviewLiquidQueryData = { __typename: 'Query', cmsParent: { __typename: 'Convention', id: string, previewLiquid: string } | { __typename: 'RootSite', id: string, previewLiquid: string } };

export type PreviewMarkdownQueryVariables = Types.Exact<{
  markdown: Types.Scalars['String']['input'];
  eventId?: Types.InputMaybe<Types.Scalars['ID']['input']>;
  eventProposalId?: Types.InputMaybe<Types.Scalars['ID']['input']>;
}>;


export type PreviewMarkdownQueryData = { __typename: 'Query', cmsParent: { __typename: 'Convention', id: string, previewMarkdown: string } | { __typename: 'RootSite', id: string, previewMarkdown: string } };

export type PreviewNotifierLiquidQueryVariables = Types.Exact<{
  eventKey: Types.Scalars['String']['input'];
  liquid: Types.Scalars['String']['input'];
}>;


export type PreviewNotifierLiquidQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, previewLiquid: string } };


export const PreviewLiquidQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PreviewLiquidQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"liquid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"cmsParent"},"name":{"kind":"Name","value":"cmsParentByRequestHost"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"previewLiquid"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"liquid"}}}]}]}}]}}]} as unknown as DocumentNode<PreviewLiquidQueryData, PreviewLiquidQueryVariables>;
export const PreviewMarkdownQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PreviewMarkdownQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"markdown"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventProposalId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"cmsParent"},"name":{"kind":"Name","value":"cmsParentByRequestHost"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"previewMarkdown"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"markdown"},"value":{"kind":"Variable","name":{"kind":"Name","value":"markdown"}}},{"kind":"Argument","name":{"kind":"Name","value":"eventId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}},{"kind":"Argument","name":{"kind":"Name","value":"eventProposalId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventProposalId"}}}]}]}}]}}]} as unknown as DocumentNode<PreviewMarkdownQueryData, PreviewMarkdownQueryVariables>;
export const PreviewNotifierLiquidQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PreviewNotifierLiquidQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventKey"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"liquid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"convention"},"name":{"kind":"Name","value":"conventionByRequestHost"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"previewLiquid"},"name":{"kind":"Name","value":"preview_notifier_liquid"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventKey"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventKey"}}},{"kind":"Argument","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"liquid"}}}]}]}}]}}]} as unknown as DocumentNode<PreviewNotifierLiquidQueryData, PreviewNotifierLiquidQueryVariables>;