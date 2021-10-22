/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { UserActivityAlertFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CreateUserActivityAlertMutationVariables = Types.Exact<{
  userActivityAlert: Types.UserActivityAlertInput;
  notificationDestinations: Array<Types.NotificationDestinationInput> | Types.NotificationDestinationInput;
}>;


export type CreateUserActivityAlertMutationData = { __typename: 'Mutation', createUserActivityAlert: { __typename: 'CreateUserActivityAlertPayload', user_activity_alert: { __typename: 'UserActivityAlert', id: string, email?: string | null | undefined, partial_name?: string | null | undefined, trigger_on_user_con_profile_create: boolean, trigger_on_ticket_create: boolean, user?: { __typename: 'User', id: string, name?: string | null | undefined } | null | undefined, notification_destinations: Array<{ __typename: 'NotificationDestination', id: string, staff_position?: { __typename: 'StaffPosition', id: string, name: string } | null | undefined, user_con_profile?: { __typename: 'UserConProfile', id: string, name_without_nickname: string } | null | undefined }> } } };

export type UpdateUserActivityAlertMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  userActivityAlert: Types.UserActivityAlertInput;
  addNotificationDestinations: Array<Types.NotificationDestinationInput> | Types.NotificationDestinationInput;
  removeNotificationDestinationIds: Array<Types.Scalars['ID']> | Types.Scalars['ID'];
}>;


export type UpdateUserActivityAlertMutationData = { __typename: 'Mutation', updateUserActivityAlert: { __typename: 'UpdateUserActivityAlertPayload', user_activity_alert: { __typename: 'UserActivityAlert', id: string, email?: string | null | undefined, partial_name?: string | null | undefined, trigger_on_user_con_profile_create: boolean, trigger_on_ticket_create: boolean, user?: { __typename: 'User', id: string, name?: string | null | undefined } | null | undefined, notification_destinations: Array<{ __typename: 'NotificationDestination', id: string, staff_position?: { __typename: 'StaffPosition', id: string, name: string } | null | undefined, user_con_profile?: { __typename: 'UserConProfile', id: string, name_without_nickname: string } | null | undefined }> } } };

export type DeleteUserActivityAlertMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type DeleteUserActivityAlertMutationData = { __typename: 'Mutation', deleteUserActivityAlert: { __typename: 'DeleteUserActivityAlertPayload', user_activity_alert: { __typename: 'UserActivityAlert', id: string, email?: string | null | undefined, partial_name?: string | null | undefined, trigger_on_user_con_profile_create: boolean, trigger_on_ticket_create: boolean, user?: { __typename: 'User', id: string, name?: string | null | undefined } | null | undefined, notification_destinations: Array<{ __typename: 'NotificationDestination', id: string, staff_position?: { __typename: 'StaffPosition', id: string, name: string } | null | undefined, user_con_profile?: { __typename: 'UserConProfile', id: string, name_without_nickname: string } | null | undefined }> } } };


export const CreateUserActivityAlertDocument = gql`
    mutation CreateUserActivityAlert($userActivityAlert: UserActivityAlertInput!, $notificationDestinations: [NotificationDestinationInput!]!) {
  createUserActivityAlert(
    input: {user_activity_alert: $userActivityAlert, notification_destinations: $notificationDestinations}
  ) {
    user_activity_alert {
      id
      ...UserActivityAlertFields
    }
  }
}
    ${UserActivityAlertFieldsFragmentDoc}`;
export type CreateUserActivityAlertMutationFn = Apollo.MutationFunction<CreateUserActivityAlertMutationData, CreateUserActivityAlertMutationVariables>;

/**
 * __useCreateUserActivityAlertMutation__
 *
 * To run a mutation, you first call `useCreateUserActivityAlertMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserActivityAlertMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserActivityAlertMutation, { data, loading, error }] = useCreateUserActivityAlertMutation({
 *   variables: {
 *      userActivityAlert: // value for 'userActivityAlert'
 *      notificationDestinations: // value for 'notificationDestinations'
 *   },
 * });
 */
export function useCreateUserActivityAlertMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserActivityAlertMutationData, CreateUserActivityAlertMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserActivityAlertMutationData, CreateUserActivityAlertMutationVariables>(CreateUserActivityAlertDocument, options);
      }
export type CreateUserActivityAlertMutationHookResult = ReturnType<typeof useCreateUserActivityAlertMutation>;
export type CreateUserActivityAlertMutationResult = Apollo.MutationResult<CreateUserActivityAlertMutationData>;
export type CreateUserActivityAlertMutationOptions = Apollo.BaseMutationOptions<CreateUserActivityAlertMutationData, CreateUserActivityAlertMutationVariables>;
export const UpdateUserActivityAlertDocument = gql`
    mutation UpdateUserActivityAlert($id: ID!, $userActivityAlert: UserActivityAlertInput!, $addNotificationDestinations: [NotificationDestinationInput!]!, $removeNotificationDestinationIds: [ID!]!) {
  updateUserActivityAlert(
    input: {transitionalId: $id, user_activity_alert: $userActivityAlert, add_notification_destinations: $addNotificationDestinations, transitionalRemoveNotificationDestinationIds: $removeNotificationDestinationIds}
  ) {
    user_activity_alert {
      id
      ...UserActivityAlertFields
    }
  }
}
    ${UserActivityAlertFieldsFragmentDoc}`;
export type UpdateUserActivityAlertMutationFn = Apollo.MutationFunction<UpdateUserActivityAlertMutationData, UpdateUserActivityAlertMutationVariables>;

/**
 * __useUpdateUserActivityAlertMutation__
 *
 * To run a mutation, you first call `useUpdateUserActivityAlertMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserActivityAlertMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserActivityAlertMutation, { data, loading, error }] = useUpdateUserActivityAlertMutation({
 *   variables: {
 *      id: // value for 'id'
 *      userActivityAlert: // value for 'userActivityAlert'
 *      addNotificationDestinations: // value for 'addNotificationDestinations'
 *      removeNotificationDestinationIds: // value for 'removeNotificationDestinationIds'
 *   },
 * });
 */
export function useUpdateUserActivityAlertMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserActivityAlertMutationData, UpdateUserActivityAlertMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserActivityAlertMutationData, UpdateUserActivityAlertMutationVariables>(UpdateUserActivityAlertDocument, options);
      }
export type UpdateUserActivityAlertMutationHookResult = ReturnType<typeof useUpdateUserActivityAlertMutation>;
export type UpdateUserActivityAlertMutationResult = Apollo.MutationResult<UpdateUserActivityAlertMutationData>;
export type UpdateUserActivityAlertMutationOptions = Apollo.BaseMutationOptions<UpdateUserActivityAlertMutationData, UpdateUserActivityAlertMutationVariables>;
export const DeleteUserActivityAlertDocument = gql`
    mutation DeleteUserActivityAlert($id: ID!) {
  deleteUserActivityAlert(input: {transitionalId: $id}) {
    user_activity_alert {
      id
      ...UserActivityAlertFields
    }
  }
}
    ${UserActivityAlertFieldsFragmentDoc}`;
export type DeleteUserActivityAlertMutationFn = Apollo.MutationFunction<DeleteUserActivityAlertMutationData, DeleteUserActivityAlertMutationVariables>;

/**
 * __useDeleteUserActivityAlertMutation__
 *
 * To run a mutation, you first call `useDeleteUserActivityAlertMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserActivityAlertMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserActivityAlertMutation, { data, loading, error }] = useDeleteUserActivityAlertMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteUserActivityAlertMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserActivityAlertMutationData, DeleteUserActivityAlertMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteUserActivityAlertMutationData, DeleteUserActivityAlertMutationVariables>(DeleteUserActivityAlertDocument, options);
      }
export type DeleteUserActivityAlertMutationHookResult = ReturnType<typeof useDeleteUserActivityAlertMutation>;
export type DeleteUserActivityAlertMutationResult = Apollo.MutationResult<DeleteUserActivityAlertMutationData>;
export type DeleteUserActivityAlertMutationOptions = Apollo.BaseMutationOptions<DeleteUserActivityAlertMutationData, DeleteUserActivityAlertMutationVariables>;