class Types::NotificationTemplateType < Types::BaseObject
  authorize_record

  field :id, Integer, null: false
  field :event_key, String, null: false
  field :subject, String, null: true
  field :body_html, String, null: true
  field :body_text, String, null: true
end
