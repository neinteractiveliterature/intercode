/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import * as Types from '../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
/** An event that can trigger a notification. */
export type NotificationEventKey =
  | 'EVENTS_EVENT_UPDATED'
  | 'EVENT_PROPOSALS_NEW_PROPOSAL'
  | 'EVENT_PROPOSALS_PROPOSAL_SUBMIT_CONFIRMATION'
  | 'EVENT_PROPOSALS_PROPOSAL_UPDATED'
  | 'EVENT_PROPOSALS_UNFINISHED_DRAFT_REMINDER'
  | 'ORDERS_CANCELLED'
  | 'ORDERS_PURCHASED'
  | 'SIGNUPS_HOLD_EXPIRED'
  | 'SIGNUPS_NEW_SIGNUP'
  | 'SIGNUPS_REGISTRATION_POLICY_CHANGE_MOVED_SIGNUPS'
  | 'SIGNUPS_SIGNUP_CONFIRMATION'
  | 'SIGNUPS_USER_SIGNUP_MOVED'
  | 'SIGNUPS_WITHDRAWAL'
  | 'SIGNUPS_WITHDRAW_CONFIRMATION'
  | 'SIGNUP_QUEUE_NO_TICKET_REMINDER'
  | 'SIGNUP_REQUESTS_NEW_SIGNUP_REQUEST'
  | 'SIGNUP_REQUESTS_REQUEST_ACCEPTED'
  | 'TICKETS_PURCHASED'
  | 'USER_ACTIVITY_ALERTS_ALERT';

export type PreviewLiquidQueryVariables = Exact<{
  liquid: string;
}>;


export type PreviewLiquidQueryData = { __typename: 'Query', cmsParent:
    | { __typename: 'Convention', id: string, previewLiquid: string }
    | { __typename: 'RootSite', id: string, previewLiquid: string }
   };

export type PreviewMarkdownQueryVariables = Exact<{
  markdown: string;
  eventId?: string | number | null | undefined;
  eventProposalId?: string | number | null | undefined;
}>;


export type PreviewMarkdownQueryData = { __typename: 'Query', cmsParent:
    | { __typename: 'Convention', id: string, previewMarkdown: string }
    | { __typename: 'RootSite', id: string, previewMarkdown: string }
   };

export type PreviewNotifierLiquidQueryVariables = Exact<{
  eventKey: Types.NotificationEventKey;
  liquid: string;
}>;


export type PreviewNotifierLiquidQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, previewLiquid: string } };


export const PreviewLiquidQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PreviewLiquidQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"liquid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"cmsParent"},"name":{"kind":"Name","value":"cmsParentByRequestHost"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"previewLiquid"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"liquid"}}}]}]}}]}}]} as unknown as DocumentNode<PreviewLiquidQueryData, PreviewLiquidQueryVariables>;
export const PreviewMarkdownQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PreviewMarkdownQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"markdown"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventProposalId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"cmsParent"},"name":{"kind":"Name","value":"cmsParentByRequestHost"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"previewMarkdown"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"markdown"},"value":{"kind":"Variable","name":{"kind":"Name","value":"markdown"}}},{"kind":"Argument","name":{"kind":"Name","value":"eventId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}},{"kind":"Argument","name":{"kind":"Name","value":"eventProposalId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventProposalId"}}}]}]}}]}}]} as unknown as DocumentNode<PreviewMarkdownQueryData, PreviewMarkdownQueryVariables>;
export const PreviewNotifierLiquidQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PreviewNotifierLiquidQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventKey"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationEventKey"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"liquid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"convention"},"name":{"kind":"Name","value":"conventionByRequestHost"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"previewLiquid"},"name":{"kind":"Name","value":"preview_notifier_liquid"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventKey"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventKey"}}},{"kind":"Argument","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"liquid"}}}]}]}}]}}]} as unknown as DocumentNode<PreviewNotifierLiquidQueryData, PreviewNotifierLiquidQueryVariables>;