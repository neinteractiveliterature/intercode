# frozen_string_literal: true
class Mutations::ForceConfirmSignup < Mutations::BaseMutation
  field :signup, Types::SignupType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false
  argument :bucket_key, String, required: true, camelize: false

  load_and_authorize_convention_associated_model :signups, :id, :force_confirm

  def resolve(**args)
    bucket = signup.run.event.registration_policy.bucket_with_key(args[:bucket_key])
    signup.update!(state: 'confirmed', bucket_key: bucket.key, counted: bucket.counted?)
    { signup: signup }
  end
end
