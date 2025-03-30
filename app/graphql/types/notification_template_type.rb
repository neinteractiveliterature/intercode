# frozen_string_literal: true
class Types::NotificationTemplateType < Types::BaseObject
  description <<~MARKDOWN
    A notification template. When a notifiable event happens, this template will be used to send out notifications
    about it.
  MARKDOWN

  authorize_record

  field :body_html, String, null: true do
    description "A Liquid template containing the email body for this notification in HTML."
  end
  field :body_sms, String, null: true do
    description "A Liquid template containing the SMS body for this notification."
  end
  field :body_text, String, null: true do # rubocop:disable GraphQL/ExtractType
    description "A Liquid template containing the email body for this notification in plain text."
  end
  field :event_key, Types::NotificationEventKey, null: false do
    description "The event key that this notification template is sent for."
  end
  field :id, ID, null: false, description: "The ID of the notification template"
  field :notification_destinations, [Types::NotificationDestinationType], null: false do
    description "The destinations that this notification will be sent to."
  end
  field :subject, String, null: true, description: "The email subject for this notification."
end
