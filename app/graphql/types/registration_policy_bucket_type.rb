# frozen_string_literal: true
class Types::RegistrationPolicyBucketType < Types::BaseObject
  description "A bucket that a run's signups can be placed into as part of a registration policy"

  field :description, String, null: true, description: "A long-form description for the bucket"
  field :id, ID, null: false, description: "The ID of this bucket"
  field :key, String, null: false, description: "The unique string identifier for this bucket"
  field :minimum_slots, Integer, null: true, description: "The minimum number of attendees needed for this bucket"
  field :name, String, null: true, description: "The name of this bucket"
  field :preferred_slots, Integer, null: true, description: "The preferred number of attendees for this bucket"
  field :total_slots, Integer, null: true, description: "The maximum number of attendees this bucket can accept"

  field :anything,
        Boolean,
        null: false,
        description: "Whether or not this is a \"flex\" bucket (\"anything\" is a legacy term for \"flex\")"
  field :expose_attendees, Boolean, null: false, description: <<~MARKDOWN
          Whether or not to allow other attendees to see that a person is in this bucket in the signup summary page
        MARKDOWN
  field :not_counted, Boolean, null: false, description: <<~MARKDOWN
          If true, attendees in this bucket are not counted towards total attendees for runs of this event, and this
          event will not count towards their maximum event signups allowed
        MARKDOWN
  field :slots_limited,
        Boolean,
        null: false,
        description: "Whether or not the number of attendees is limited in this bucket"

  %w[slots_limited anything not_counted expose_attendees].each do |field_name|
    define_method field_name do
      !!object.public_send(:"#{field_name}?")
    end
  end
end
