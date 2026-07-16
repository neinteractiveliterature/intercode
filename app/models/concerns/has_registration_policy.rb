# frozen_string_literal: true
module HasRegistrationPolicy
  extend ActiveSupport::Concern

  # A proposed registration policy change that differs from the current one, returned by
  # #registration_policy_change_for. `new_policy` is a detached, unsaved RegistrationPolicy the
  # caller applies however is appropriate for their model (in-place update, first-time
  # assignment, running signup simulation, etc.). `old_json` is captured up front, since applying
  # the change may mutate the owner's registration_policy row in place rather than replacing it --
  # reading it again afterward would already show the new state.
  class Change
    attr_reader :new_policy, :old_json

    def initialize(new_policy:, old_json:)
      @new_policy = new_policy
      @old_json = old_json
    end
  end

  # Builds a detached proposed RegistrationPolicy from `hash` and returns a Change describing it,
  # or nil if `hash` is blank or describes a policy equivalent to the current one (nothing to
  # apply).
  def registration_policy_change_for(hash)
    return nil unless hash

    new_policy = RegistrationPolicy.build_from_hash(hash)
    return nil if registration_policy&.equivalent_to?(new_policy)

    Change.new(new_policy:, old_json: registration_policy&.as_json)
  end
end
