/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type UpdateNotificationTemplateMutationVariables = Types.Exact<{
  eventKey: Types.NotificationEventKey;
  notificationTemplate: Types.NotificationTemplateInput;
}>;


export type UpdateNotificationTemplateMutationData = { __typename: 'Mutation', updateNotificationTemplate: { __typename: 'UpdateNotificationTemplatePayload', notification_template: { __typename: 'NotificationTemplate', id: string, event_key: Types.NotificationEventKey, subject?: string | null, body_html?: string | null, body_text?: string | null, body_sms?: string | null, notification_destinations: Array<{ __typename: 'NotificationDestination', id: string, dynamic_destination?: Types.NotificationDynamicDestination | null, staff_position?: { __typename: 'StaffPosition', id: string, name: string } | null, user_con_profile?: { __typename: 'UserConProfile', id: string, name_without_nickname: string } | null, conditions?: Array<{ __typename: 'NotificationCondition', condition_type: Types.NotificationConditionType, value?: string | null }> | null }> } } };

export type SendNotificationPreviewMutationVariables = Types.Exact<{
  eventKey: Types.NotificationEventKey;
  email: Types.Scalars['Boolean']['input'];
  sms: Types.Scalars['Boolean']['input'];
}>;


export type SendNotificationPreviewMutationData = { __typename: 'Mutation', sendNotificationPreview: { __typename: 'SendNotificationPreviewPayload', clientMutationId?: string | null } };


export const UpdateNotificationTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateNotificationTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventKey"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationEventKey"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"notificationTemplate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationTemplateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateNotificationTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"event_key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventKey"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"notification_template"},"value":{"kind":"Variable","name":{"kind":"Name","value":"notificationTemplate"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notification_template"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"NotificationTemplateFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationTemplateFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationTemplate"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"event_key"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"body_html"}},{"kind":"Field","name":{"kind":"Name","value":"body_text"}},{"kind":"Field","name":{"kind":"Name","value":"body_sms"}},{"kind":"Field","name":{"kind":"Name","value":"notification_destinations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"dynamic_destination"}},{"kind":"Field","name":{"kind":"Name","value":"staff_position"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user_con_profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name_without_nickname"}}]}},{"kind":"Field","name":{"kind":"Name","value":"conditions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"condition_type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateNotificationTemplateMutationData, UpdateNotificationTemplateMutationVariables>;
export const SendNotificationPreviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendNotificationPreview"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventKey"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationEventKey"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sms"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendNotificationPreview"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"event_key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventKey"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"sms"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sms"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clientMutationId"}}]}}]}}]} as unknown as DocumentNode<SendNotificationPreviewMutationData, SendNotificationPreviewMutationVariables>;