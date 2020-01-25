class NotificationTemplate < ApplicationRecord
  include Cadmus::Concerns::LiquidTemplateField

  belongs_to :convention
  liquid_template_field :subject_template, :subject
  liquid_template_field :body_html_template, :body_html
  liquid_template_field :body_text_template, :body_text
  liquid_template_field :body_sms_template, :body_sms
  validates_template_validity :subject
  validates_template_validity :body_html
  validates_template_validity :body_text
  validates_template_validity :body_sms
end
