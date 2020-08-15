/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { UserActivityAlertFieldsFragment } from './queries.generated';
import { gql } from '@apollo/client';
import { UserActivityAlertFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';


export type CreateUserActivityAlertMutationVariables = Types.Exact<{
  userActivityAlert: Types.UserActivityAlertInput;
  notificationDestinations: Array<Types.NotificationDestinationInput>;
}>;


export type CreateUserActivityAlertMutation = (
  { __typename?: 'Mutation' }
  & { createUserActivityAlert?: Types.Maybe<(
    { __typename?: 'CreateUserActivityAlertPayload' }
    & { user_activity_alert: (
      { __typename?: 'UserActivityAlert' }
      & Pick<Types.UserActivityAlert, 'id'>
      & UserActivityAlertFieldsFragment
    ) }
  )> }
);

export type UpdateUserActivityAlertMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
  userActivityAlert: Types.UserActivityAlertInput;
  addNotificationDestinations: Array<Types.NotificationDestinationInput>;
  removeNotificationDestinationIds: Array<Types.Scalars['Int']>;
}>;


export type UpdateUserActivityAlertMutation = (
  { __typename?: 'Mutation' }
  & { updateUserActivityAlert?: Types.Maybe<(
    { __typename?: 'UpdateUserActivityAlertPayload' }
    & { user_activity_alert: (
      { __typename?: 'UserActivityAlert' }
      & Pick<Types.UserActivityAlert, 'id'>
      & UserActivityAlertFieldsFragment
    ) }
  )> }
);

export type DeleteUserActivityAlertMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type DeleteUserActivityAlertMutation = (
  { __typename?: 'Mutation' }
  & { deleteUserActivityAlert?: Types.Maybe<(
    { __typename?: 'DeleteUserActivityAlertPayload' }
    & { user_activity_alert: (
      { __typename?: 'UserActivityAlert' }
      & Pick<Types.UserActivityAlert, 'id'>
      & UserActivityAlertFieldsFragment
    ) }
  )> }
);


export const CreateUserActivityAlertDocument = gql`
    mutation CreateUserActivityAlert($userActivityAlert: UserActivityAlertInput!, $notificationDestinations: [NotificationDestinationInput!]!) {
  createUserActivityAlert(input: {user_activity_alert: $userActivityAlert, notification_destinations: $notificationDestinations}) {
    user_activity_alert {
      id
      ...UserActivityAlertFields
    }
  }
}
    ${UserActivityAlertFieldsFragmentDoc}`;
export type CreateUserActivityAlertMutationFn = Apollo.MutationFunction<CreateUserActivityAlertMutation, CreateUserActivityAlertMutationVariables>;

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
export function useCreateUserActivityAlertMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserActivityAlertMutation, CreateUserActivityAlertMutationVariables>) {
        return Apollo.useMutation<CreateUserActivityAlertMutation, CreateUserActivityAlertMutationVariables>(CreateUserActivityAlertDocument, baseOptions);
      }
export type CreateUserActivityAlertMutationHookResult = ReturnType<typeof useCreateUserActivityAlertMutation>;
export type CreateUserActivityAlertMutationResult = Apollo.MutationResult<CreateUserActivityAlertMutation>;
export type CreateUserActivityAlertMutationOptions = Apollo.BaseMutationOptions<CreateUserActivityAlertMutation, CreateUserActivityAlertMutationVariables>;
export const UpdateUserActivityAlertDocument = gql`
    mutation UpdateUserActivityAlert($id: Int!, $userActivityAlert: UserActivityAlertInput!, $addNotificationDestinations: [NotificationDestinationInput!]!, $removeNotificationDestinationIds: [Int!]!) {
  updateUserActivityAlert(input: {id: $id, user_activity_alert: $userActivityAlert, add_notification_destinations: $addNotificationDestinations, remove_notification_destination_ids: $removeNotificationDestinationIds}) {
    user_activity_alert {
      id
      ...UserActivityAlertFields
    }
  }
}
    ${UserActivityAlertFieldsFragmentDoc}`;
export type UpdateUserActivityAlertMutationFn = Apollo.MutationFunction<UpdateUserActivityAlertMutation, UpdateUserActivityAlertMutationVariables>;

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
export function useUpdateUserActivityAlertMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserActivityAlertMutation, UpdateUserActivityAlertMutationVariables>) {
        return Apollo.useMutation<UpdateUserActivityAlertMutation, UpdateUserActivityAlertMutationVariables>(UpdateUserActivityAlertDocument, baseOptions);
      }
export type UpdateUserActivityAlertMutationHookResult = ReturnType<typeof useUpdateUserActivityAlertMutation>;
export type UpdateUserActivityAlertMutationResult = Apollo.MutationResult<UpdateUserActivityAlertMutation>;
export type UpdateUserActivityAlertMutationOptions = Apollo.BaseMutationOptions<UpdateUserActivityAlertMutation, UpdateUserActivityAlertMutationVariables>;
export const DeleteUserActivityAlertDocument = gql`
    mutation DeleteUserActivityAlert($id: Int!) {
  deleteUserActivityAlert(input: {id: $id}) {
    user_activity_alert {
      id
      ...UserActivityAlertFields
    }
  }
}
    ${UserActivityAlertFieldsFragmentDoc}`;
export type DeleteUserActivityAlertMutationFn = Apollo.MutationFunction<DeleteUserActivityAlertMutation, DeleteUserActivityAlertMutationVariables>;

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
export function useDeleteUserActivityAlertMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserActivityAlertMutation, DeleteUserActivityAlertMutationVariables>) {
        return Apollo.useMutation<DeleteUserActivityAlertMutation, DeleteUserActivityAlertMutationVariables>(DeleteUserActivityAlertDocument, baseOptions);
      }
export type DeleteUserActivityAlertMutationHookResult = ReturnType<typeof useDeleteUserActivityAlertMutation>;
export type DeleteUserActivityAlertMutationResult = Apollo.MutationResult<DeleteUserActivityAlertMutation>;
export type DeleteUserActivityAlertMutationOptions = Apollo.BaseMutationOptions<DeleteUserActivityAlertMutation, DeleteUserActivityAlertMutationVariables>;