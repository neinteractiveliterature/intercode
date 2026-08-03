# frozen_string_literal: true
class Types::SignupMoveResultType < Types::BaseObject
  description "The result of a signup being automatically moved from one state or bucket to another"

  field :bucket, Types::RegistrationPolicyBucketType, null: true, description: "The new bucket assigned to this signup"
  field :bucket_key,
        String,
        null: true,
        deprecation_reason: "Use bucket instead",
        description: "The key of the new bucket assigned to this signup"
  field :prev_bucket,
        Types::RegistrationPolicyBucketType,
        null: true,
        description: "The previous bucket assigned to this signup"
  field :prev_bucket_key,
        String,
        null: true,
        deprecation_reason: "Use prevBucket instead",
        description: "The key of the previous bucket assigned to this signup"
  field :prev_state, # rubocop:disable GraphQL/ExtractType
        Types::SignupStateType,
        null: false,
        description: "The previous state of this signup"
  field :signup, Types::SignupType, null: false, description: "The signup that was moved"
  field :signup_id, Int, null: false, description: "The ID of the signup that was moved"
  field :state, Types::SignupStateType, null: false, description: "The new state of this signup"

  def signup
    dataloader.with(Sources::ModelById, Signup).load(object.signup_id)
  end

  def bucket_key
    object.bucket&.key
  end

  def prev_bucket_key
    object.prev_bucket&.key
  end
end
