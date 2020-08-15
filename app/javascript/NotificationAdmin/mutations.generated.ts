/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { NotificationTemplateFieldsFragment } from './queries.generated';
import { gql } from '@apollo/client';
import { NotificationTemplateFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';


export type UpdateNotificationTemplateMutationVariables = Types.Exact<{
  eventKey: Types.Scalars['String'];
  notificationTemplate: Types.NotificationTemplateInput;
}>;


export type UpdateNotificationTemplateMutation = (
  { __typename?: 'Mutation' }
  & { updateNotificationTemplate?: Types.Maybe<(
    { __typename?: 'UpdateNotificationTemplatePayload' }
    & { notification_template: (
      { __typename?: 'NotificationTemplate' }
      & Pick<Types.NotificationTemplate, 'id'>
      & NotificationTemplateFieldsFragment
    ) }
  )> }
);


export const UpdateNotificationTemplateDocument = gql`
    mutation UpdateNotificationTemplate($eventKey: String!, $notificationTemplate: NotificationTemplateInput!) {
  updateNotificationTemplate(input: {event_key: $eventKey, notification_template: $notificationTemplate}) {
    notification_template {
      id
      ...NotificationTemplateFields
    }
  }
}
    ${NotificationTemplateFieldsFragmentDoc}`;
export type UpdateNotificationTemplateMutationFn = Apollo.MutationFunction<UpdateNotificationTemplateMutation, UpdateNotificationTemplateMutationVariables>;

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
export function useUpdateNotificationTemplateMutation(baseOptions?: Apollo.MutationHookOptions<UpdateNotificationTemplateMutation, UpdateNotificationTemplateMutationVariables>) {
        return Apollo.useMutation<UpdateNotificationTemplateMutation, UpdateNotificationTemplateMutationVariables>(UpdateNotificationTemplateDocument, baseOptions);
      }
export type UpdateNotificationTemplateMutationHookResult = ReturnType<typeof useUpdateNotificationTemplateMutation>;
export type UpdateNotificationTemplateMutationResult = Apollo.MutationResult<UpdateNotificationTemplateMutation>;
export type UpdateNotificationTemplateMutationOptions = Apollo.BaseMutationOptions<UpdateNotificationTemplateMutation, UpdateNotificationTemplateMutationVariables>;