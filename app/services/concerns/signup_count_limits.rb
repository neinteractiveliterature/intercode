# frozen_string_literal: true
module SignupCountLimits
  extend ActiveSupport::Concern

  included { validate :signup_count_must_be_allowed }

  def signup_count_must_be_allowed
    return unless signup_count_check_required?

    case user_signup_constraints.max_signups_allowed
    when "not_now"
      nil # ConventionRegistrationFreeze will take care of this
    when "not_yet"
      errors.add :base, I18n.t("signups.errors.closed")
    else
      user_signup_count =
        user_signup_constraints.current_signup_count + user_signup_constraints.pending_signup_request_count
      unless user_signup_constraints.signup_count_allowed?(user_signup_count + 1)
        errors.add :base, I18n.t("signups.errors.already_at_max", count: user_signup_count)
      end
    end
  end

  def signup_count_check_required?
    return false if team_member?
    return false if Signup::SLOT_OCCUPYING_STATES.include?(signup_state) && !counts_towards_total?
    return false if action == "accept_signup_request"

    true
  end

  def team_member?
    return @is_team_member unless @is_team_member.nil?
    @is_team_member = event.team_members.where(user_con_profile_id: user_con_profile.id).any?
  end
end
