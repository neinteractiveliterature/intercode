# frozen_string_literal: true
class Types::RegistrationPolicyBucketType < Types::BaseObject
  field :description, String, null: true
  field :key, String, null: false
  field :minimum_slots, Integer, null: true
  field :name, String, null: true
  field :preferred_slots, Integer, null: true
  field :total_slots, Integer, null: true

  field :anything, Boolean, null: false
  field :expose_attendees, Boolean, null: false
  field :not_counted, Boolean, null: false
  field :slots_limited, Boolean, null: false

  %w[slots_limited anything not_counted expose_attendees].each do |field_name|
    define_method field_name do
      !!object.public_send(:"#{field_name}?")
    end
  end
end
