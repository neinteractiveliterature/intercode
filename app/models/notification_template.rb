class NotificationTemplate < ApplicationRecord
  include Cadmus::Concerns::LiquidTemplateField

  belongs_to :convention
  liquid_template_field :subject_template, :subject
  liquid_template_field :body_template, :body
  validates_template_validity :subject
  validates_template_validity :body
end
