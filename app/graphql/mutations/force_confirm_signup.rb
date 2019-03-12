class Mutations::ForceConfirmSignup < Mutations::BaseMutation
  field :signup, Types::SignupType, null: false

  argument :id, Integer, required: true
  argument :bucket_key, String, required: true, camelize: false

  def resolve(**args)
    signup = convention.signups.find(args[:id])
    signup.update!(state: 'confirmed', bucket_key: args[:bucket_key])
    { signup: signup }
  end
end
