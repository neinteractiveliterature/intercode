import { gql } from '@apollo/client';
import { UserActivityAlertFields } from './queries';

export const CreateUserActivityAlert = gql`
  mutation CreateUserActivityAlert(
    $userActivityAlert: UserActivityAlertInput!
    $notificationDestinations: [NotificationDestinationInput!]!
  ) {
    createUserActivityAlert(
      input: { user_activity_alert: $userActivityAlert, notification_destinations: $notificationDestinations }
    ) {
      user_activity_alert {
        id: transitionalId
        ...UserActivityAlertFields
      }
    }
  }

  ${UserActivityAlertFields}
`;

export const UpdateUserActivityAlert = gql`
  mutation UpdateUserActivityAlert(
    $id: ID!
    $userActivityAlert: UserActivityAlertInput!
    $addNotificationDestinations: [NotificationDestinationInput!]!
    $removeNotificationDestinationIds: [ID!]!
  ) {
    updateUserActivityAlert(
      input: {
        transitionalId: $id
        user_activity_alert: $userActivityAlert
        add_notification_destinations: $addNotificationDestinations
        transitionalRemoveNotificationDestinationIds: $removeNotificationDestinationIds
      }
    ) {
      user_activity_alert {
        id: transitionalId
        ...UserActivityAlertFields
      }
    }
  }

  ${UserActivityAlertFields}
`;

export const DeleteUserActivityAlert = gql`
  mutation DeleteUserActivityAlert($id: ID!) {
    deleteUserActivityAlert(input: { transitionalId: $id }) {
      user_activity_alert {
        id: transitionalId
        ...UserActivityAlertFields
      }
    }
  }

  ${UserActivityAlertFields}
`;
