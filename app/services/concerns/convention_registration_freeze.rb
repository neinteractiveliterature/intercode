module ConventionRegistrationFreeze
  extend ActiveSupport::Concern

  included do
    validate :registrations_must_not_be_frozen
    validate :convention_must_not_be_canceled
  end

  def registrations_must_not_be_frozen
    return unless convention.registrations_frozen?
    errors.add :base, "Registrations for #{convention.name} are frozen."
  end

  def convention_must_not_be_canceled
    return unless convention.canceled?
    errors.add :base, "#{convention.name} is canceled (and therefore registrations are frozen)."
  end
end
