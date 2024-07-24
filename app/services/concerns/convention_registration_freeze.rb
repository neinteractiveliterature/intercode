# frozen_string_literal: true
module ConventionRegistrationFreeze
  extend ActiveSupport::Concern

  included do
    validate :registrations_must_not_be_frozen
    validate :convention_must_not_be_canceled
    validate :must_not_have_signup_rounds_due
  end

  def registrations_must_not_be_frozen
    return unless convention.registrations_frozen?
    errors.add :base, I18n.t("signups.errors.frozen", convention_name: convention.name)
  end

  def convention_must_not_be_canceled
    return unless convention.canceled?
    errors.add :base, I18n.t("signups.errors.convention_canceled", convention_name: convention.name)
  end

  def must_not_have_signup_rounds_due
    return if action == "accept_signup_ranked_choice"
    return unless convention.signup_automation_mode == "ranked_choice"
    return unless convention.signup_rounds.currently_due.any?

    errors.add :base, I18n.t("signups.errors.signup_round_in_progress")
  end
end
