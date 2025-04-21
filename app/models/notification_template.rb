# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: notification_templates
#
#  id            :bigint           not null, primary key
#  body_html     :text
#  body_sms      :text
#  body_text     :text
#  event_key     :string           not null
#  subject       :text
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  convention_id :bigint           not null
#
# Indexes
#
#  index_notification_templates_on_convention_id  (convention_id)
#
# Foreign Keys
#
#  fk_rails_...  (convention_id => conventions.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

class NotificationTemplate < ApplicationRecord
  include Cadmus::Concerns::LiquidTemplateField

  belongs_to :convention
  has_many :notification_destinations, as: :source, dependent: :destroy
  after_create :create_default_destinations!

  liquid_template_field :subject_template, :subject
  liquid_template_field :body_html_template, :body_html
  liquid_template_field :body_text_template, :body_text
  liquid_template_field :body_sms_template, :body_sms
  validates_template_validity :subject
  validates_template_validity :body_html
  validates_template_validity :body_text
  validates_template_validity :body_sms

  delegate :allowed_dynamic_destinations, :allowed_conditions, to: :notifier_class

  def notifier_class
    Notifier.notifier_class_for_event_key(event_key)
  end

  def create_default_destinations!
    notifier_class.build_default_destinations(notification_template: self).each(&:save!)
  end
end
