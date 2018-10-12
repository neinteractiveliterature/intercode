class UserActivityAlert < ApplicationRecord
  belongs_to :convention
  belongs_to :user, optional: true
  has_many :alert_destinations, as: :alert

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

    emails = [user_con_profile.email, user.email].map { |email| normalize_email(email) }
    trigger_email = normalize_email(email)
    emails.any? { |email| trigger_email == normalize_email(email) }
  end

  def destination_user_con_profiles
    alert_destinations.flat_map(&:user_con_profiles).compact.uniq
  end

  private

  def normalize_email(email)
    email.downcase.gsub(/\.(?=.*?@)/, '').gsub(/\+.*(?=@)/, '')
  end
end
