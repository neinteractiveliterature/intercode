# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: notification_destinations
#
#  id                  :bigint           not null, primary key
#  conditions          :jsonb
#  dynamic_destination :text
#  source_type         :string           not null
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  source_id           :bigint           not null
#  staff_position_id   :bigint
#  user_con_profile_id :bigint
#
# Indexes
#
#  index_notification_destinations_on_source_type_and_source_id  (source_type,source_id)
#  index_notification_destinations_on_staff_position_id          (staff_position_id)
#  index_notification_destinations_on_user_con_profile_id        (user_con_profile_id)
#
# Foreign Keys
#
#  fk_rails_...  (staff_position_id => staff_positions.id)
#  fk_rails_...  (user_con_profile_id => user_con_profiles.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

class NotificationDestination < ApplicationRecord
  belongs_to :source, polymorphic: true
  belongs_to :staff_position, optional: true
  belongs_to :user_con_profile, optional: true

  validate :ensure_dynamic_destination_allowed_for_source
  validate :ensure_all_conditions_allowed_for_source

  def user_con_profiles
    staff_position ? staff_position.user_con_profiles : [user_con_profile]
  end

  private

  def ensure_dynamic_destination_allowed_for_source
    return unless dynamic_destination
    return if source.allowed_dynamic_destinations.include?(dynamic_destination.to_sym)

    errors.add :dynamic_destination,
               "is not valid this source. Valid options: #{source.allowed_dynamic_destinations.to_sentence}"
  end

  def ensure_all_conditions_allowed_for_source
    return unless conditions

    allowed_conditions = Set.new(source.allowed_conditions.map(&:to_s))
    invalid_conditions = conditions.keys.filter { |key| allowed_conditions.exclude(key) }
    return if invalid_conditions.empty?

    errors.add :conditions,
               "#{invalid_conditions.to_sentence} not allowed for this source. \
Valid options: #{source.allowed_conditions.to_sentence}"
  end
end
