import { gql } from '@apollo/client';
import { UserActivityAlertFields } from './queries';

export const CreateUserActivityAlert = gql`
  mutation CreateUserActivityAlert(
    $userActivityAlert: UserActivityAlertInput!
    $notificationDestinations: [NotificationDestinationInput!]!
  ) {
    createUserActivityAlert(
      input: {
        user_activity_alert: $userActivityAlert
        notification_destinations: $notificationDestinations
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

export const UpdateUserActivityAlert = gql`
  mutation UpdateUserActivityAlert(
    $id: Int!
    $userActivityAlert: UserActivityAlertInput!
    $addNotificationDestinations: [NotificationDestinationInput!]!
    $removeNotificationDestinationIds: [Int!]!
  ) {
    updateUserActivityAlert(
      input: {
        id: $id
        user_activity_alert: $userActivityAlert
        add_notification_destinations: $addNotificationDestinations
        remove_notification_destination_ids: $removeNotificationDestinationIds
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
  mutation DeleteUserActivityAlert($id: Int!) {
    deleteUserActivityAlert(input: { id: $id }) {
      user_activity_alert {
        id: transitionalId
        ...UserActivityAlertFields
      }
    }
  }

  ${UserActivityAlertFields}
`;
