/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { NotificationTemplateFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UpdateNotificationTemplateMutationVariables = Types.Exact<{
  eventKey: Types.Scalars['String'];
  notificationTemplate: Types.NotificationTemplateInput;
}>;


export type UpdateNotificationTemplateMutationData = { __typename: 'Mutation', updateNotificationTemplate: { __typename: 'UpdateNotificationTemplatePayload', notification_template: { __typename: 'NotificationTemplate', id: string, event_key: string, subject?: string | null, body_html?: string | null, body_text?: string | null, body_sms?: string | null } } };

export type SendNotificationPreviewMutationVariables = Types.Exact<{
  eventKey: Types.Scalars['String'];
  email: Types.Scalars['Boolean'];
  sms: Types.Scalars['Boolean'];
}>;


export type SendNotificationPreviewMutationData = { __typename: 'Mutation', sendNotificationPreview: { __typename: 'SendNotificationPreviewPayload', clientMutationId?: string | null } };


export const UpdateNotificationTemplateDocument = gql`
    mutation UpdateNotificationTemplate($eventKey: String!, $notificationTemplate: NotificationTemplateInput!) {
  updateNotificationTemplate(
    input: {event_key: $eventKey, notification_template: $notificationTemplate}
  ) {
    notification_template {
      id
      ...NotificationTemplateFields
    }
  }
}
    ${NotificationTemplateFieldsFragmentDoc}`;
export type UpdateNotificationTemplateMutationFn = Apollo.MutationFunction<UpdateNotificationTemplateMutationData, UpdateNotificationTemplateMutationVariables>;

/**
 * __useUpdateNotificationTemplateMutation__
 *
 * To run a mutation, you first call `useUpdateNotificationTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateNotificationTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateNotificationTemplateMutation, { data, loading, error }] = useUpdateNotificationTemplateMutation({
 *   variables: {
 *      eventKey: // value for 'eventKey'
 *      notificationTemplate: // value for 'notificationTemplate'
 *   },
 * });
 */
export function useUpdateNotificationTemplateMutation(baseOptions?: Apollo.MutationHookOptions<UpdateNotificationTemplateMutationData, UpdateNotificationTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateNotificationTemplateMutationData, UpdateNotificationTemplateMutationVariables>(UpdateNotificationTemplateDocument, options);
      }
export type UpdateNotificationTemplateMutationHookResult = ReturnType<typeof useUpdateNotificationTemplateMutation>;
export type UpdateNotificationTemplateMutationResult = Apollo.MutationResult<UpdateNotificationTemplateMutationData>;
export type UpdateNotificationTemplateMutationOptions = Apollo.BaseMutationOptions<UpdateNotificationTemplateMutationData, UpdateNotificationTemplateMutationVariables>;
export const SendNotificationPreviewDocument = gql`
    mutation SendNotificationPreview($eventKey: String!, $email: Boolean!, $sms: Boolean!) {
  sendNotificationPreview(input: {event_key: $eventKey, email: $email, sms: $sms}) {
    clientMutationId
  }
}
    `;
export type SendNotificationPreviewMutationFn = Apollo.MutationFunction<SendNotificationPreviewMutationData, SendNotificationPreviewMutationVariables>;

/**
 * __useSendNotificationPreviewMutation__
 *
 * To run a mutation, you first call `useSendNotificationPreviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendNotificationPreviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendNotificationPreviewMutation, { data, loading, error }] = useSendNotificationPreviewMutation({
 *   variables: {
 *      eventKey: // value for 'eventKey'
 *      email: // value for 'email'
 *      sms: // value for 'sms'
 *   },
 * });
 */
export function useSendNotificationPreviewMutation(baseOptions?: Apollo.MutationHookOptions<SendNotificationPreviewMutationData, SendNotificationPreviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendNotificationPreviewMutationData, SendNotificationPreviewMutationVariables>(SendNotificationPreviewDocument, options);
      }
export type SendNotificationPreviewMutationHookResult = ReturnType<typeof useSendNotificationPreviewMutation>;
export type SendNotificationPreviewMutationResult = Apollo.MutationResult<SendNotificationPreviewMutationData>;
export type SendNotificationPreviewMutationOptions = Apollo.BaseMutationOptions<SendNotificationPreviewMutationData, SendNotificationPreviewMutationVariables>;