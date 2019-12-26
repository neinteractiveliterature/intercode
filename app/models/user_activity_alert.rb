class UserActivityAlert < ApplicationRecord
  belongs_to :convention
  belongs_to :user, optional: true
  has_many :notification_destinations, as: :source, dependent: :destroy

  def trigger?(event, user_con_profile)
    trigger_on_event?(event) && matches?(user_con_profile)
  end

  def trigger_on_event?(event)
    case event.to_sym
    when :user_con_profile_create then trigger_on_user_con_profile_create?
    when :ticket_create then trigger_on_ticket_create?
    else false
    end
  end

  def matches?(user_con_profile)
    matches_user?(user_con_profile) ||
      matches_name?(user_con_profile) ||
      matches_email?(user_con_profile)
  end

  def matches_user?(user_con_profile)
    user && user_con_profile.user == user
  end

  def matches_name?(user_con_profile)
    return unless partial_name.present?

    names = [
      user_con_profile.name,
      user_con_profile.name_without_nickname,
      user_con_profile.user.name
    ].map(&:downcase)

    names.any? { |name| name.include?(partial_name.downcase) }
  end

  def matches_email?(user_con_profile)
    return unless email.present?

    # UserConProfile doesn't have its own email field; it delegates to User
    normalize_email(user_con_profile.email) == normalize_email(email)
  end

  def destination_user_con_profiles
    notification_destinations.flat_map(&:user_con_profiles).compact.uniq
  end

  private

  def normalize_email(email)
    email.downcase.gsub(/\.(?=.*?@)/, '').gsub(/\+.*(?=@)/, '')
  end
end
