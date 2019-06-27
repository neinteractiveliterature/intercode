class Mutations::RejectSignupRequest < Mutations::BaseMutation
  field :signup_request, Types::SignupRequestType, null: false

  argument :id, Int, required: true, camelize: false

  def resolve(id:)
    signup_request = convention.signup_requests.find(id)
    signup_request.update!(state: 'rejected')

    { signup_request: signup_request }
  end
end
