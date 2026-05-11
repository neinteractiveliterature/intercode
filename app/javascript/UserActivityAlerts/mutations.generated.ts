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

export type UserActivityAlertInput = {
  email?: string | null | undefined;
  partial_name?: string | null | undefined;
  trigger_on_ticket_create?: boolean | null | undefined;
  trigger_on_user_con_profile_create?: boolean | null | undefined;
  userId?: string | number | null | undefined;
};

export type CreateUserActivityAlertMutationVariables = Exact<{
  userActivityAlert: Types.UserActivityAlertInput;
  notificationDestinations: Array<Types.NotificationDestinationInput> | Types.NotificationDestinationInput;
}>;


export type CreateUserActivityAlertMutationData = { __typename: 'Mutation', createUserActivityAlert: { __typename: 'CreateUserActivityAlertPayload', user_activity_alert: { __typename: 'UserActivityAlert', id: string, email: string | null, partial_name: string | null, trigger_on_user_con_profile_create: boolean, trigger_on_ticket_create: boolean, convention: { __typename: 'Convention', id: string }, user: { __typename: 'User', id: string, name: string | null, email: string | null } | null, notification_destinations: Array<{ __typename: 'NotificationDestination', id: string, staff_position: { __typename: 'StaffPosition', id: string, name: string } | null, user_con_profile: { __typename: 'UserConProfile', id: string, name_without_nickname: string } | null }> } } };

export type UpdateUserActivityAlertMutationVariables = Exact<{
  id: string | number;
  userActivityAlert: Types.UserActivityAlertInput;
  addNotificationDestinations: Array<Types.NotificationDestinationInput> | Types.NotificationDestinationInput;
  removeNotificationDestinationIds: Array<string | number> | string | number;
}>;


export type UpdateUserActivityAlertMutationData = { __typename: 'Mutation', updateUserActivityAlert: { __typename: 'UpdateUserActivityAlertPayload', user_activity_alert: { __typename: 'UserActivityAlert', id: string, email: string | null, partial_name: string | null, trigger_on_user_con_profile_create: boolean, trigger_on_ticket_create: boolean, user: { __typename: 'User', id: string, name: string | null, email: string | null } | null, notification_destinations: Array<{ __typename: 'NotificationDestination', id: string, staff_position: { __typename: 'StaffPosition', id: string, name: string } | null, user_con_profile: { __typename: 'UserConProfile', id: string, name_without_nickname: string } | null }> } } };

export type DeleteUserActivityAlertMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteUserActivityAlertMutationData = { __typename: 'Mutation', deleteUserActivityAlert: { __typename: 'DeleteUserActivityAlertPayload', user_activity_alert: { __typename: 'UserActivityAlert', id: string, email: string | null, partial_name: string | null, trigger_on_user_con_profile_create: boolean, trigger_on_ticket_create: boolean, user: { __typename: 'User', id: string, name: string | null, email: string | null } | null, notification_destinations: Array<{ __typename: 'NotificationDestination', id: string, staff_position: { __typename: 'StaffPosition', id: string, name: string } | null, user_con_profile: { __typename: 'UserConProfile', id: string, name_without_nickname: string } | null }> } } };


export const CreateUserActivityAlertDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUserActivityAlert"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userActivityAlert"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserActivityAlertInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"notificationDestinations"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationDestinationInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUserActivityAlert"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"user_activity_alert"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userActivityAlert"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"notification_destinations"},"value":{"kind":"Variable","name":{"kind":"Name","value":"notificationDestinations"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_activity_alert"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserActivityAlertFields"}},{"kind":"Field","name":{"kind":"Name","value":"convention"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserActivityAlertFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserActivityAlert"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"partial_name"}},{"kind":"Field","name":{"kind":"Name","value":"trigger_on_user_con_profile_create"}},{"kind":"Field","name":{"kind":"Name","value":"trigger_on_ticket_create"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"notification_destinations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"staff_position"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user_con_profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name_without_nickname"}}]}}]}}]}}]} as unknown as DocumentNode<CreateUserActivityAlertMutationData, CreateUserActivityAlertMutationVariables>;
export const UpdateUserActivityAlertDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUserActivityAlert"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userActivityAlert"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserActivityAlertInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"addNotificationDestinations"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationDestinationInput"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"removeNotificationDestinationIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUserActivityAlert"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"user_activity_alert"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userActivityAlert"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"add_notification_destinations"},"value":{"kind":"Variable","name":{"kind":"Name","value":"addNotificationDestinations"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"removeNotificationDestinationIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"removeNotificationDestinationIds"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_activity_alert"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserActivityAlertFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserActivityAlertFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserActivityAlert"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"partial_name"}},{"kind":"Field","name":{"kind":"Name","value":"trigger_on_user_con_profile_create"}},{"kind":"Field","name":{"kind":"Name","value":"trigger_on_ticket_create"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"notification_destinations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"staff_position"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user_con_profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name_without_nickname"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateUserActivityAlertMutationData, UpdateUserActivityAlertMutationVariables>;
export const DeleteUserActivityAlertDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteUserActivityAlert"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteUserActivityAlert"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_activity_alert"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserActivityAlertFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserActivityAlertFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserActivityAlert"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"partial_name"}},{"kind":"Field","name":{"kind":"Name","value":"trigger_on_user_con_profile_create"}},{"kind":"Field","name":{"kind":"Name","value":"trigger_on_ticket_create"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"notification_destinations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"staff_position"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user_con_profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name_without_nickname"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteUserActivityAlertMutationData, DeleteUserActivityAlertMutationVariables>;