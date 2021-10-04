# frozen_string_literal: true
class Mutations::ForceConfirmSignup < Mutations::BaseMutation
  field :signup, Types::SignupType, null: false

  argument :id,
           Integer,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false
  argument :transitional_id, ID, required: false, camelize: true
  argument :bucket_key, String, required: true, camelize: false

  load_and_authorize_convention_associated_model :signups, :id, :force_confirm

  def resolve(**args)
    bucket = signup.run.event.registration_policy.bucket_with_key(args[:bucket_key])
    signup.update!(state: 'confirmed', bucket_key: bucket.key, counted: bucket.counted?)
    { signup: signup }
  end
end
