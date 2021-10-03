# frozen_string_literal: true
class Types::RegistrationPolicyInputType < Types::BaseInputObject
  argument :buckets, [Types::RegistrationPolicyBucketInputType], required: false
  argument :prevent_no_preference_signups, Boolean, required: false, camelize: false
end
