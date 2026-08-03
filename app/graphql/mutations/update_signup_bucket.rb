# frozen_string_literal: true
class Mutations::UpdateSignupBucket < Mutations::BaseMutation
  description "Move a signup into a different bucket, backfilling the vacancy it leaves behind"

  field :signup, Types::SignupType, null: false, description: "The updated signup"

  argument :bucket_id, ID, required: false, description: "The bucket to move the signup into"
  argument :bucket_key,
           String,
           required: false,
           camelize: false,
           deprecation_reason: "Use bucketId instead",
           description: "The bucket key to move the signup into"
  argument :id, ID, required: false, description: "The ID of the signup to move" # rubocop:disable GraphQL/ExtractInputType

  load_and_authorize_convention_associated_model :signups, :id, :update_bucket

  def resolve(**args)
    bucket_id = requested_bucket_id(args)
    raise "The selected bucket is full." if signup.run.bucket_full?(bucket_id) && signup.counted?

    original_bucket_id = signup.bucket_id
    signup.update!(bucket_id:)
    fill_vacated_bucket(original_bucket_id)

    { signup: signup.reload }
  end

  private

  def requested_bucket_id(args)
    bucket =
      if args[:bucket_id]
        signup.run.registration_policy.bucket_with_id(args[:bucket_id].to_i)
      else
        signup.run.registration_policy.bucket_with_key(args[:bucket_key])
      end
    raise GraphQL::ExecutionError, "Bad request: bucketId or bucketKey is required" unless bucket
    bucket.id
  end

  def fill_vacated_bucket(original_bucket_id)
    return unless signup.bucket_id_previously_changed? && signup.counted? && original_bucket_id

    EventVacancyFillService.new(
      signup.run,
      original_bucket_id,
      immovable_signups: signup.run.signups.confirmed.to_a
    ).call!
  end
end
