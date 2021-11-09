# frozen_string_literal: true
class Mutations::UpdateSignupBucket < Mutations::BaseMutation
  field :signup, Types::SignupType, null: false

  argument :id, ID, required: false
  argument :bucket_key, String, required: true, camelize: false

  load_and_authorize_convention_associated_model :signups, :id, :update_bucket

  def resolve(**args)
    raise 'The selected bucket is full.' if signup.run.bucket_full?(args[:bucket_key]) && signup.counted?

    original_bucket_key = signup.bucket_key
    signup.update!(bucket_key: args[:bucket_key])

    if signup.bucket_key_previously_changed? && signup.counted? && original_bucket_key
      EventVacancyFillService.new(signup.run, original_bucket_key, immovable_signups: signup.run.signups.confirmed.to_a)
        .call!
    end

    { signup: signup.reload }
  end
end
