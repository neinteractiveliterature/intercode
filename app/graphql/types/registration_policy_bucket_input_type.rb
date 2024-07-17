# frozen_string_literal: true
class Types::RegistrationPolicyBucketInputType < Types::BaseInputObject
  argument :anything, Boolean, required: false
  argument :description, String, required: false
  argument :expose_attendees, Boolean, required: false, camelize: false
  argument :key, String, required: true
  argument :minimum_slots, Integer, required: false, camelize: false
  argument :name, String, required: false
  argument :not_counted, Boolean, required: false, camelize: false
  argument :preferred_slots, Integer, required: false, camelize: false
  argument :slots_limited, Boolean, required: false, camelize: false
  argument :total_slots, Integer, required: false, camelize: false
end
