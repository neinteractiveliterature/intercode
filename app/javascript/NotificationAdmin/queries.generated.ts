/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import * as Types from '../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
/** The type of a notification condition. This is used to determine what kind of condition it is and how to evaluate it. */
export type NotificationConditionType =
  | 'EVENT_CATEGORY';

/**
 * A dynamic destination for notifications.  Dynamic destinations are evaluated at runtime to determine
 * the actual destination for a notification.
 */
export type NotificationDynamicDestination =
  | 'EVENT_PROPOSAL_OWNER'
  | 'EVENT_TEAM_MEMBERS'
  | 'ORDER_USER_CON_PROFILE'
  | 'SIGNUP_RANKED_CHOICE_USER_CON_PROFILE'
  | 'SIGNUP_REQUEST_USER_CON_PROFILE'
  | 'SIGNUP_USER_CON_PROFILE'
  | 'TICKET_USER_CON_PROFILE'
  | 'TRIGGERING_USER'
  | 'USER_ACTIVITY_ALERT_DESTINATIONS';

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

export type NotificationTemplateFieldsFragment = { __typename: 'NotificationTemplate', id: string, event_key: Types.NotificationEventKey, subject: string | null, body_html: string | null, body_text: string | null, body_sms: string | null, notification_destinations: Array<{ __typename: 'NotificationDestination', id: string, dynamic_destination: Types.NotificationDynamicDestination | null, staff_position: { __typename: 'StaffPosition', id: string, name: string } | null, user_con_profile: { __typename: 'UserConProfile', id: string, name_without_nickname: string } | null, conditions: Array<{ __typename: 'NotificationCondition', condition_type: Types.NotificationConditionType, value: string | null }> | null }> };

export type NotificationsConfigFragment = { __typename: 'Query', notificationEvents: Array<{ __typename: 'NotificationEvent', key: Types.NotificationEventKey, category: string, allowed_condition_types: Array<Types.NotificationConditionType>, allowed_dynamic_destinations: Array<Types.NotificationDynamicDestination>, sends_sms: boolean }> };

export type NotificationsConfigQueryVariables = Exact<{ [key: string]: never; }>;


export type NotificationsConfigQueryData = { __typename: 'Query', notificationEvents: Array<{ __typename: 'NotificationEvent', key: Types.NotificationEventKey, category: string, allowed_condition_types: Array<Types.NotificationConditionType>, allowed_dynamic_destinations: Array<Types.NotificationDynamicDestination>, sends_sms: boolean }> };

export type NotificationAdminQueryVariables = Exact<{ [key: string]: never; }>;


export type NotificationAdminQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, notification_templates: Array<{ __typename: 'NotificationTemplate', id: string, event_key: Types.NotificationEventKey, subject: string | null, body_html: string | null, body_text: string | null, body_sms: string | null, notification_destinations: Array<{ __typename: 'NotificationDestination', id: string, dynamic_destination: Types.NotificationDynamicDestination | null, staff_position: { __typename: 'StaffPosition', id: string, name: string } | null, user_con_profile: { __typename: 'UserConProfile', id: string, name_without_nickname: string } | null, conditions: Array<{ __typename: 'NotificationCondition', condition_type: Types.NotificationConditionType, value: string | null }> | null }> }>, staff_positions: Array<{ __typename: 'StaffPosition', id: string, name: string }>, event_categories: Array<{ __typename: 'EventCategory', id: string, name: string }> }, notificationEvents: Array<{ __typename: 'NotificationEvent', key: Types.NotificationEventKey, category: string, allowed_condition_types: Array<Types.NotificationConditionType>, allowed_dynamic_destinations: Array<Types.NotificationDynamicDestination>, sends_sms: boolean }> };

export const NotificationTemplateFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationTemplateFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationTemplate"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"event_key"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"body_html"}},{"kind":"Field","name":{"kind":"Name","value":"body_text"}},{"kind":"Field","name":{"kind":"Name","value":"body_sms"}},{"kind":"Field","name":{"kind":"Name","value":"notification_destinations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"dynamic_destination"}},{"kind":"Field","name":{"kind":"Name","value":"staff_position"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user_con_profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name_without_nickname"}}]}},{"kind":"Field","name":{"kind":"Name","value":"conditions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"condition_type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]} as unknown as DocumentNode<NotificationTemplateFieldsFragment, unknown>;
export const NotificationsConfigFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationsConfig"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notificationEvents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"allowed_condition_types"}},{"kind":"Field","name":{"kind":"Name","value":"allowed_dynamic_destinations"}},{"kind":"Field","name":{"kind":"Name","value":"sends_sms"}}]}}]}}]} as unknown as DocumentNode<NotificationsConfigFragment, unknown>;
export const NotificationsConfigQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NotificationsConfigQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NotificationsConfig"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationsConfig"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notificationEvents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"allowed_condition_types"}},{"kind":"Field","name":{"kind":"Name","value":"allowed_dynamic_destinations"}},{"kind":"Field","name":{"kind":"Name","value":"sends_sms"}}]}}]}}]} as unknown as DocumentNode<NotificationsConfigQueryData, NotificationsConfigQueryVariables>;
export const NotificationAdminQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NotificationAdminQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"convention"},"name":{"kind":"Name","value":"conventionByRequestHost"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"notification_templates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"NotificationTemplateFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"staff_positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"event_categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"NotificationsConfig"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationTemplateFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationTemplate"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"event_key"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"body_html"}},{"kind":"Field","name":{"kind":"Name","value":"body_text"}},{"kind":"Field","name":{"kind":"Name","value":"body_sms"}},{"kind":"Field","name":{"kind":"Name","value":"notification_destinations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"dynamic_destination"}},{"kind":"Field","name":{"kind":"Name","value":"staff_position"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user_con_profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name_without_nickname"}}]}},{"kind":"Field","name":{"kind":"Name","value":"conditions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"condition_type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationsConfig"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notificationEvents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"allowed_condition_types"}},{"kind":"Field","name":{"kind":"Name","value":"allowed_dynamic_destinations"}},{"kind":"Field","name":{"kind":"Name","value":"sends_sms"}}]}}]}}]} as unknown as DocumentNode<NotificationAdminQueryData, NotificationAdminQueryVariables>;