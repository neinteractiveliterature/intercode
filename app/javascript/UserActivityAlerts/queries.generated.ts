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

export type TicketMode =
  /** Tickets are neither sold nor required in this convention */
  | 'disabled'
  /** A valid ticket is required to sign up for events in this convention */
  | 'required_for_signup'
  /** Each event in this convention sells tickets separately */
  | 'ticket_per_event';

export type UserActivityAlertsAdminConventionFieldsFragment = { __typename: 'Convention', id: string, ticket_name: string, ticket_mode: Types.TicketMode, staff_positions: Array<{ __typename: 'StaffPosition', id: string, name: string }> };

export type UserActivityAlertFieldsFragment = { __typename: 'UserActivityAlert', id: string, email: string | null, partial_name: string | null, trigger_on_user_con_profile_create: boolean, trigger_on_ticket_create: boolean, user: { __typename: 'User', id: string, name: string | null, email: string | null } | null, notification_destinations: Array<{ __typename: 'NotificationDestination', id: string, staff_position: { __typename: 'StaffPosition', id: string, name: string } | null, user_con_profile: { __typename: 'UserConProfile', id: string, name_without_nickname: string } | null }> };

export type UserActivityAlertsAdminQueryVariables = Exact<{ [key: string]: never; }>;


export type UserActivityAlertsAdminQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, ticket_name: string, ticket_mode: Types.TicketMode, user_activity_alerts: Array<{ __typename: 'UserActivityAlert', id: string, email: string | null, partial_name: string | null, trigger_on_user_con_profile_create: boolean, trigger_on_ticket_create: boolean, user: { __typename: 'User', id: string, name: string | null, email: string | null } | null, notification_destinations: Array<{ __typename: 'NotificationDestination', id: string, staff_position: { __typename: 'StaffPosition', id: string, name: string } | null, user_con_profile: { __typename: 'UserConProfile', id: string, name_without_nickname: string } | null }> }>, event_categories: Array<{ __typename: 'EventCategory', id: string, name: string }>, staff_positions: Array<{ __typename: 'StaffPosition', id: string, name: string }> }, notificationEvents: Array<{ __typename: 'NotificationEvent', key: Types.NotificationEventKey, allowed_condition_types: Array<Types.NotificationConditionType>, allowed_dynamic_destinations: Array<Types.NotificationDynamicDestination> }> };

export const UserActivityAlertsAdminConventionFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserActivityAlertsAdminConventionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Convention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_name"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_mode"}},{"kind":"Field","name":{"kind":"Name","value":"staff_positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UserActivityAlertsAdminConventionFieldsFragment, unknown>;
export const UserActivityAlertFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserActivityAlertFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserActivityAlert"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"partial_name"}},{"kind":"Field","name":{"kind":"Name","value":"trigger_on_user_con_profile_create"}},{"kind":"Field","name":{"kind":"Name","value":"trigger_on_ticket_create"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"notification_destinations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"staff_position"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user_con_profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name_without_nickname"}}]}}]}}]}}]} as unknown as DocumentNode<UserActivityAlertFieldsFragment, unknown>;
export const UserActivityAlertsAdminQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserActivityAlertsAdminQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"convention"},"name":{"kind":"Name","value":"conventionByRequestHost"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserActivityAlertsAdminConventionFields"}},{"kind":"Field","name":{"kind":"Name","value":"user_activity_alerts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserActivityAlertFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"event_categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"notificationEvents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"allowed_condition_types"}},{"kind":"Field","name":{"kind":"Name","value":"allowed_dynamic_destinations"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserActivityAlertsAdminConventionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Convention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_name"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_mode"}},{"kind":"Field","name":{"kind":"Name","value":"staff_positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserActivityAlertFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserActivityAlert"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"partial_name"}},{"kind":"Field","name":{"kind":"Name","value":"trigger_on_user_con_profile_create"}},{"kind":"Field","name":{"kind":"Name","value":"trigger_on_ticket_create"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"notification_destinations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"staff_position"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user_con_profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name_without_nickname"}}]}}]}}]}}]} as unknown as DocumentNode<UserActivityAlertsAdminQueryData, UserActivityAlertsAdminQueryVariables>;