module Concerns::ConventionRegistrationFreeze
  extend ActiveSupport::Concern

  included do
    validate :registrations_must_not_be_frozen
  end

  def registrations_must_not_be_frozen
    errors.add :base, "Registrations for #{convention.name} are frozen." if convention.registrations_frozen?
  end
end
