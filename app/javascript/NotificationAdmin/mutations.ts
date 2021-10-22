import { gql } from '@apollo/client';
import { NotificationTemplateFields } from './queries';

export const UpdateNotificationTemplate = gql`
  mutation UpdateNotificationTemplate($eventKey: String!, $notificationTemplate: NotificationTemplateInput!) {
    updateNotificationTemplate(input: { event_key: $eventKey, notification_template: $notificationTemplate }) {
      notification_template {
        id
        ...NotificationTemplateFields
      }
    }
  }

  ${NotificationTemplateFields}
`;
