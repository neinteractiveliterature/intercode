module Concerns::ConventionRegistrationFreeze
  extend ActiveSupport::Concern

  included do
    validate :registrations_must_not_be_frozen
  end

  def registrations_must_not_be_frozen
    return unless convention.registrations_frozen?
    errors.add :base, "Registrations for #{convention.name} are frozen."
  end
end
