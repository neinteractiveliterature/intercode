# frozen_string_literal: true
class Types::NotificationTemplateType < Types::BaseObject
  authorize_record

  field :body_html, String, null: true
  field :body_sms, String, null: true
  field :body_text, String, null: true
  field :event_key, String, null: false
  field :id, ID, null: false
  field :subject, String, null: true
end
