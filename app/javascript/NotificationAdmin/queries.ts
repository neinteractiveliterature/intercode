import { gql } from '@apollo/client';

export const NotificationTemplateFields = gql`
  fragment NotificationTemplateFields on NotificationTemplate {
    id: transitionalId
    event_key
    subject
    body_html
    body_text
    body_sms
  }
`;

export const NotificationAdminQuery = gql`
  query NotificationAdminQuery {
    convention: conventionByRequestHost {
      id: transitionalId

      notification_templates {
        id: transitionalId
        ...NotificationTemplateFields
      }
    }
  }

  ${NotificationTemplateFields}
`;
