/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import * as Types from '../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
/** An input type for creating or updating conditions that must be met for a notification to be sent to a destination. */
export type NotificationConditionInput = {
  /** The type of condition. */
  conditionType: NotificationConditionType;
  /** The value of the condition.  This will vary depending on the condition type. */
  value?: string | null | undefined;
};

/** The type of a notification condition. This is used to determine what kind of condition it is and how to evaluate it. */
export type NotificationConditionType =
  | 'EVENT_CATEGORY';

/** Input type for creating or updating a notification destination. */
export type NotificationDestinationInput = {
  /** The conditions under which the notification will be sent to this destination */
  conditions?: Array<NotificationConditionInput> | null | undefined;
  /** The dynamic destination to send the notification to */
  dynamicDestination?: NotificationDynamicDestination | null | undefined;
  /** The ID of the staff position to send the notification to */
  staffPositionId?: string | number | null | undefined;
  /** The ID of the user con profile to send the notification to */
  userConProfileId?: string | number | null | undefined;
};

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

export type NotificationTemplateInput = {
  body_html?: string | null | undefined;
  body_sms?: string | null | undefined;
  body_text?: string | null | undefined;
  subject?: string | null | undefined;
};

export type UpdateNotificationTemplateMutationVariables = Exact<{
  eventKey: Types.NotificationEventKey;
  notificationTemplate: Types.NotificationTemplateInput;
  addDestinations?: Array<Types.NotificationDestinationInput> | Types.NotificationDestinationInput | null | undefined;
  removeDestinationIds?: Array<string | number> | string | number | null | undefined;
}>;


export type UpdateNotificationTemplateMutationData = { __typename: 'Mutation', updateNotificationTemplate: { __typename: 'UpdateNotificationTemplatePayload', notification_template: { __typename: 'NotificationTemplate', id: string, event_key: Types.NotificationEventKey, subject: string | null, body_html: string | null, body_text: string | null, body_sms: string | null, notification_destinations: Array<{ __typename: 'NotificationDestination', id: string, dynamic_destination: Types.NotificationDynamicDestination | null, staff_position: { __typename: 'StaffPosition', id: string, name: string } | null, user_con_profile: { __typename: 'UserConProfile', id: string, name_without_nickname: string } | null, conditions: Array<{ __typename: 'NotificationCondition', condition_type: Types.NotificationConditionType, value: string | null }> | null }> } } };

export type SendNotificationPreviewMutationVariables = Exact<{
  eventKey: Types.NotificationEventKey;
  email: boolean;
  sms: boolean;
}>;


export type SendNotificationPreviewMutationData = { __typename: 'Mutation', sendNotificationPreview: { __typename: 'SendNotificationPreviewPayload', clientMutationId: string | null } };


export const UpdateNotificationTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateNotificationTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventKey"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationEventKey"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"notificationTemplate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationTemplateInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"addDestinations"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationDestinationInput"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"removeDestinationIds"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateNotificationTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"event_key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventKey"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"notification_template"},"value":{"kind":"Variable","name":{"kind":"Name","value":"notificationTemplate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"add_destinations"},"value":{"kind":"Variable","name":{"kind":"Name","value":"addDestinations"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"remove_destination_ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"removeDestinationIds"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notification_template"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"NotificationTemplateFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationTemplateFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationTemplate"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"event_key"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"body_html"}},{"kind":"Field","name":{"kind":"Name","value":"body_text"}},{"kind":"Field","name":{"kind":"Name","value":"body_sms"}},{"kind":"Field","name":{"kind":"Name","value":"notification_destinations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"dynamic_destination"}},{"kind":"Field","name":{"kind":"Name","value":"staff_position"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user_con_profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name_without_nickname"}}]}},{"kind":"Field","name":{"kind":"Name","value":"conditions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"condition_type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateNotificationTemplateMutationData, UpdateNotificationTemplateMutationVariables>;
export const SendNotificationPreviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendNotificationPreview"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventKey"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationEventKey"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sms"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendNotificationPreview"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"event_key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventKey"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"sms"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sms"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clientMutationId"}}]}}]}}]} as unknown as DocumentNode<SendNotificationPreviewMutationData, SendNotificationPreviewMutationVariables>;