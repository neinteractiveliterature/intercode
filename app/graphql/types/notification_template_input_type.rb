class Types::NotificationTemplateInputType < Types::BaseInputObject
  argument :subject, String, required: false, camelize: false
  argument :body_html, String, required: false, camelize: false
  argument :body_text, String, required: false, camelize: false
end
