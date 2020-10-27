import { gql } from '@apollo/client';

export const NotificationTemplateFields = gql`
  fragment NotificationTemplateFields on NotificationTemplate {
    id
    event_key
    subject
    body_html
    body_text
    body_sms
  }
`;

export const NotificationAdminQuery = gql`
  query NotificationAdminQuery {
    convention: assertConvention {
      id

      notification_templates {
        id
        ...NotificationTemplateFields
      }
    }
  }

  ${NotificationTemplateFields}
`;
