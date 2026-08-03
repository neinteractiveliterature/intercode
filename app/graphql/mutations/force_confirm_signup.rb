# frozen_string_literal: true
class Mutations::ForceConfirmSignup < Mutations::BaseMutation
  description "Force-confirm a signup into a specific bucket, bypassing capacity limits"

  field :signup, Types::SignupType, null: false, description: "The signup that was confirmed"

  argument :bucket_id, ID, required: false, description: "The bucket to confirm the signup into"
  argument :bucket_key,
           String,
           required: false,
           camelize: false,
           deprecation_reason: "Use bucketId instead",
           description: "The bucket key to confirm the signup into"
  argument :id, ID, required: false, description: "The ID of the signup to confirm" # rubocop:disable GraphQL/ExtractInputType

  load_and_authorize_convention_associated_model :signups, :id, :force_confirm

  def resolve(**args)
    bucket =
      if args[:bucket_id]
        signup.run.registration_policy.bucket_with_id(args[:bucket_id].to_i)
      else
        signup.run.event.registration_policy.bucket_with_key(args[:bucket_key])
      end
    signup.update!(state: "confirmed", bucket_id: bucket.id, counted: bucket.counted?)
    { signup: }
  end
end
