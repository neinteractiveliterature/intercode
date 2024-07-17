# frozen_string_literal: true
class Types::NotificationTemplateInputType < Types::BaseInputObject
  argument :body_html, String, required: false, camelize: false
  argument :body_sms, String, required: false, camelize: false
  argument :body_text, String, required: false, camelize: false
  argument :subject, String, required: false, camelize: false
end
