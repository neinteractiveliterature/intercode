class Mutations::ForceConfirmSignup < Mutations::BaseMutation
  field :signup, Types::SignupType, null: false

  argument :id, Integer, required: true
  argument :bucket_key, String, required: true, camelize: false

  def resolve(**args)
    signup = convention.signups.find(args[:id])
    bucket = signup.run.event.registration_policy.bucket_with_key(args[:bucket_key])
    signup.update!(state: 'confirmed', bucket_key: bucket.key, counted: bucket.counted?)
    { signup: signup }
  end
end
