class Mutations::AcceptSignupRequest < Mutations::BaseMutation
  field :signup, Types::SignupType, null: false
  field :signup_request, Types::SignupRequestType, null: false

  argument :id, Int, required: true, camelize: false

  def resolve(id:)
    signup_request = convention.signup_requests.find(id)

    result = AcceptSignupRequestService.new(
      signup_request: signup_request,
      whodunit: current_user
    ).call

    if result.failure?
      raise BetterRescueMiddleware::UnloggedError, result.errors.full_messages.join(', ')
    end

    { signup: result.signup, signup_request: signup_request }
  end
end
