# frozen_string_literal: true
class Mutations::ForceConfirmSignup < Mutations::BaseMutation
  field :signup, Types::SignupType, null: false

  argument :bucket_key, String, required: true, camelize: false
  argument :id, ID, required: false

  load_and_authorize_convention_associated_model :signups, :id, :force_confirm

  def resolve(**args)
    bucket = signup.run.event.registration_policy.bucket_with_key(args[:bucket_key])
    signup.update!(state: "confirmed", bucket_key: bucket.key, counted: bucket.counted?)
    { signup: }
  end
end
