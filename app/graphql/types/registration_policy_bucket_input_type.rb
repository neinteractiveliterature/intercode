# frozen_string_literal: true
class Types::RegistrationPolicyBucketInputType < Types::BaseInputObject
  argument :key, String, required: true
  argument :name, String, required: false
  argument :description, String, required: false
  argument :minimum_slots, Integer, required: false, camelize: false
  argument :preferred_slots, Integer, required: false, camelize: false
  argument :total_slots, Integer, required: false, camelize: false
  argument :slots_limited, Boolean, required: false, camelize: false
  argument :anything, Boolean, required: false
  argument :not_counted, Boolean, required: false, camelize: false
  argument :expose_attendees, Boolean, required: false, camelize: false
end
