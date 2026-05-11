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

export type LiquidAssignFieldsFragment = { __typename: 'LiquidAssign', name: string, drop_class_name: string, cms_variable_value_json: string | null };

export type LiquidAssignsQueryVariables = Exact<{ [key: string]: never; }>;


export type LiquidAssignsQueryData = { __typename: 'Query', cmsParent:
    | { __typename: 'Convention', id: string, liquidAssigns: Array<{ __typename: 'LiquidAssign', name: string, drop_class_name: string, cms_variable_value_json: string | null }> }
    | { __typename: 'RootSite', id: string, liquidAssigns: Array<{ __typename: 'LiquidAssign', name: string, drop_class_name: string, cms_variable_value_json: string | null }> }
   };

export type NotifierLiquidAssignsQueryVariables = Exact<{
  eventKey: Types.NotificationEventKey;
}>;


export type NotifierLiquidAssignsQueryData = { __typename: 'Query', cmsParent: { __typename: 'Convention', id: string, liquidAssigns: Array<{ __typename: 'LiquidAssign', name: string, drop_class_name: string, cms_variable_value_json: string | null }> } };

export const LiquidAssignFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LiquidAssignFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LiquidAssign"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"drop_class_name"}},{"kind":"Field","name":{"kind":"Name","value":"cms_variable_value_json"}}]}}]} as unknown as DocumentNode<LiquidAssignFieldsFragment, unknown>;
export const LiquidAssignsQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LiquidAssignsQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"cmsParent"},"name":{"kind":"Name","value":"cmsParentByRequestHost"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"liquidAssigns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LiquidAssignFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LiquidAssignFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LiquidAssign"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"drop_class_name"}},{"kind":"Field","name":{"kind":"Name","value":"cms_variable_value_json"}}]}}]} as unknown as DocumentNode<LiquidAssignsQueryData, LiquidAssignsQueryVariables>;
export const NotifierLiquidAssignsQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NotifierLiquidAssignsQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventKey"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationEventKey"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"cmsParent"},"name":{"kind":"Name","value":"conventionByRequestHost"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"liquidAssigns"},"name":{"kind":"Name","value":"notifier_liquid_assigns"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventKey"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventKey"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LiquidAssignFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LiquidAssignFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LiquidAssign"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"drop_class_name"}},{"kind":"Field","name":{"kind":"Name","value":"cms_variable_value_json"}}]}}]} as unknown as DocumentNode<NotifierLiquidAssignsQueryData, NotifierLiquidAssignsQueryVariables>;