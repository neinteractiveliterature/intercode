# frozen_string_literal: true
module ConventionRegistrationFreeze
  extend ActiveSupport::Concern

  included do
    validate :registrations_must_not_be_frozen
    validate :convention_must_not_be_canceled
  end

  def registrations_must_not_be_frozen
    return unless convention.registrations_frozen?
    errors.add :base, I18n.t("signups.errors.frozen", convention_name: convention.name)
  end

  def convention_must_not_be_canceled
    return unless convention.canceled?
    errors.add :base, I18n.t("signups.errors.convention_canceled", convention_name: convention.name)
  end
end
