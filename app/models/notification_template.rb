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

  delegate :allowed_dynamic_destinations, to: :notifier

  def notifier
    Notifier.for_event_key(event_key, convention:)
  end

  def create_default_destinations!
    notifier.default_destinations.each do |default_destination|
      case default_destination
      when UserConProfile
        notification_destinations.create!(user_con_profile: default_destination)
      when StaffPosition
        notification_destinations.create!(staff_position: default_destination)
      when Symbol
        notification_destinations.create!(dynamic_destination: default_destination)
      else
        raise "Invalid default destination: #{default_destination.inspect}"
      end
    end
  end
end
