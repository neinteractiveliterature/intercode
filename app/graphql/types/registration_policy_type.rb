# frozen_string_literal: true
class Types::RegistrationPolicyType < Types::BaseObject
  description <<~MARKDOWN
  A registration policy describes how signups for an event will work.  A registration policy consists of a set of
  buckets, each of which holds space for signups.  Additionally, the registration policy contains a few other options
  that can be set that affect the behavior of signups as a whole for this event.

  For more on registration policies, [see the signups documentation](https://intercode.interactiveliterature.org/docs/concepts/signups).
  MARKDOWN

  field :buckets, [Types::RegistrationPolicyBucketType], null: false do
    description "The buckets in this registration policy."
  end
  field :freeze_no_preference_buckets, Boolean, null: false do
    description "If true, no-preference signups in this event cannot be moved once their bucket has been assigned."
  end
  field :minimum_slots, Integer, null: true, description: "The sum of minimum slots across all counted buckets."
  field :minimum_slots_including_not_counted, Integer, null: true do # rubocop:disable GraphQL/ExtractType
    description "The sum of minimum slots across all buckets, including not-counted buckets."
  end
  field :only_uncounted, Boolean, method: :only_uncounted?, null: true do
    description "Does this registration policy include only not-counted buckets?"
  end
  field :preferred_slots, Integer, null: true, description: "The sum of preferred slots across all counted buckets."
  field :preferred_slots_including_not_counted, Integer, null: true do # rubocop:disable GraphQL/ExtractType
    description "The sum of preferred slots across all buckets, including not-counted buckets."
  end
  field :prevent_no_preference_signups, Boolean, null: false do
    description "If true, no-preference signups will not be allowed for this event."
  end
  field :slots_limited, Boolean, method: :slots_limited?, null: true do
    description <<~MARKDOWN
      Does this event have an effectively-limited number of slots?

      The logic for this is more complex than it might first appear.  An event's slots are effectively unlimited if it
      either:

      - Has a counted + unlimited bucket
      - Has a not-counted + unlimited bucket, and no counted buckets

      Therefore, this will be true if both of the above conditions are false.
    MARKDOWN
  end
  field :total_slots, Integer, null: true, description: "The sum of total slots across all counted buckets."
  field :total_slots_including_not_counted, Integer, null: true do # rubocop:disable GraphQL/ExtractType
    description "The sum of total slots across all buckets, including not-counted buckets."
  end
end
