# frozen_string_literal: true
class Types::NotificationTemplateType < Types::BaseObject
  authorize_record

  field :id,
        Integer,
        deprecation_reason:
          'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
        null: false
  field :transitional_id, ID, method: :id, null: false, camelize: true
  field :event_key, String, null: false
  field :subject, String, null: true
  field :body_html, String, null: true
  field :body_text, String, null: true
  field :body_sms, String, null: true
end
