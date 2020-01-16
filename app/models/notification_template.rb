class NotificationTemplate < ApplicationRecord
  include Cadmus::Concerns::LiquidTemplateField

  belongs_to :convention
  belongs_to :notification_context, polymorphic: true, required: false
  liquid_template_field :subject_template, :subject
  liquid_template_field :body_html_template, :body_html
  liquid_template_field :body_text_template, :body_text
  validates_template_validity :subject
  validates_template_validity :body_html
  validates_template_validity :body_text

  before_destroy :ensure_override_template_before_destroy

  private

  def ensure_override_template_before_destroy
    return if notification_context_type && notification_context_id

    throw :abort
  end
end
