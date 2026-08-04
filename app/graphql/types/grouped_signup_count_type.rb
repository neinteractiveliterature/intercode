# frozen_string_literal: true
class Types::GroupedSignupCountType < Types::BaseObject
  description "A count of signups sharing the same state, bucket, counted-ness, and team-member status"

  field :bucket, Types::RegistrationPolicyBucketType, null: true, description: "The bucket these signups are in"
  field :bucket_key,
        String,
        null: true,
        deprecation_reason: "Use bucket instead",
        description: "The key of the bucket these signups are in"
  field :count, Integer, null: false, description: "The number of signups in this group"
  field :counted, Boolean, null: false, description: "Whether these signups count towards totals"
  field :requested_bucket,
        Types::RegistrationPolicyBucketType,
        null: true,
        description: "The bucket these signups requested"
  field :requested_bucket_key, # rubocop:disable GraphQL/ExtractType
        String,
        null: true,
        deprecation_reason: "Use requestedBucket instead",
        description: "The key of the bucket these signups requested"
  field :state, Types::SignupStateType, null: false, description: "The state these signups are in"
  field :team_member, Boolean, null: false, description: "Whether these signups belong to event team members"

  def bucket
    return unless object[:bucket_id]
    dataloader.with(Sources::ModelById, RegistrationPolicyBucket).load(object[:bucket_id])
  end

  def requested_bucket
    return unless object[:requested_bucket_id]
    dataloader.with(Sources::ModelById, RegistrationPolicyBucket).load(object[:requested_bucket_id])
  end

  def bucket_key
    bucket&.key
  end

  def requested_bucket_key
    requested_bucket&.key
  end
end
