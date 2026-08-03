# frozen_string_literal: true
module HasRegistrationPolicy
  extend ActiveSupport::Concern

  # A proposed registration policy change, returned by #registration_policy_change_for.
  class Change
    # @!attribute [r] new_policy
    #   @return [RegistrationPolicy] a detached, unsaved policy for the caller to apply
    # @!attribute [r] old_json
    #   @return [Hash, nil] the current policy's JSON, captured before applying the change
    attr_reader :new_policy, :old_json

    def initialize(new_policy:, old_json:)
      @new_policy = new_policy
      @old_json = old_json
    end
  end

  # @param hash [Hash, nil] a raw registration policy hash (e.g. from form response attrs)
  # @return [Change, nil] nil if hash is blank or describes a policy equivalent to the current one
  def registration_policy_change_for(hash)
    return nil unless hash

    new_policy = RegistrationPolicy.build_from_hash(hash)
    return nil if registration_policy&.equivalent_to?(new_policy)

    Change.new(new_policy:, old_json: registration_policy&.as_json)
  end
end
