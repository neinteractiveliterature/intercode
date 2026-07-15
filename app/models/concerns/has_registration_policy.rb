# frozen_string_literal: true
module HasRegistrationPolicy
  extend ActiveSupport::Concern

  # Builds a detached proposed RegistrationPolicy from `hash`, and -- if it actually differs
  # from the current one -- captures an eager "before" JSON snapshot (the caller's block may
  # update the current policy's rows in place rather than replacing them, so capturing
  # afterward would show the already-updated state), yields the proposal for the caller to
  # apply however is appropriate, and returns a {"registration_policy" => [old, new]} change
  # hash for FormResponseChange logging. Returns {} if there's nothing to apply.
  def apply_registration_policy_change(hash)
    return {} unless hash

    new_registration_policy = RegistrationPolicy.build_from_hash(hash)
    return {} if registration_policy&.equivalent_to?(new_registration_policy)

    old_registration_policy_json = registration_policy&.as_json
    yield new_registration_policy
    { "registration_policy" => [old_registration_policy_json, registration_policy.as_json] }
  end
end
