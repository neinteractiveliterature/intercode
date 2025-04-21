# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: user_activity_alerts
#
#  id                                 :bigint           not null, primary key
#  email                              :text
#  partial_name                       :text
#  trigger_on_ticket_create           :boolean          default(FALSE), not null
#  trigger_on_user_con_profile_create :boolean          default(FALSE), not null
#  created_at                         :datetime         not null
#  updated_at                         :datetime         not null
#  convention_id                      :bigint           not null
#  user_id                            :bigint
#
# Indexes
#
#  index_user_activity_alerts_on_convention_id  (convention_id)
#  index_user_activity_alerts_on_user_id        (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (convention_id => conventions.id)
#  fk_rails_...  (user_id => users.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

class UserActivityAlert < ApplicationRecord
  belongs_to :convention
  belongs_to :user, optional: true
  has_many :notification_destinations, as: :source, dependent: :destroy

  def trigger?(event, user_con_profile)
    trigger_on_event?(event) && matches?(user_con_profile)
  end

  def trigger_on_event?(event)
    case event.to_sym
    when :user_con_profile_create
      trigger_on_user_con_profile_create?
    when :ticket_create
      trigger_on_ticket_create?
    else
      false
    end
  end

  def matches?(user_con_profile)
    no_filters? || matches_user?(user_con_profile) || matches_name?(user_con_profile) ||
      matches_email?(user_con_profile)
  end

  def matches_user?(user_con_profile)
    user && user_con_profile.user == user
  end

  def matches_name?(user_con_profile)
    return false if partial_name.blank?

    names = [user_con_profile.name, user_con_profile.name_without_nickname, user_con_profile.user.name].map(&:downcase)

    names.any? { |name| name.include?(partial_name.downcase) }
  end

  def matches_email?(user_con_profile)
    return false if email.blank?

    # UserConProfile doesn't have its own email field; it delegates to User
    normalize_email(user_con_profile.email) == normalize_email(email)
  end

  def no_filters?
    partial_name.blank? && email.blank? && !user
  end

  def allowed_dynamic_destinations
    []
  end

  def allowed_conditions
    []
  end

  private

  def normalize_email(email)
    email.downcase.gsub(/\.(?=.*?@)/, "").gsub(/\+.*(?=@)/, "")
  end
end
