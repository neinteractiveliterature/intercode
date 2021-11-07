# frozen_string_literal: true
class Types::NotificationTemplateType < Types::BaseObject
  authorize_record

  field :transitional_id,
        ID,
        deprecation_reason:
          "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
        null: false,
        method: :id,
        camelize: true
  field :id, ID, null: false
  field :event_key, String, null: false
  field :subject, String, null: true
  field :body_html, String, null: true
  field :body_text, String, null: true
  field :body_sms, String, null: true
end
