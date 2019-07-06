class Mutations::AcceptSignupRequest < Mutations::BaseMutation
  field :signup, Types::SignupType, null: false
  field :signup_request, Types::SignupRequestType, null: false

  argument :id, Int, required: true, camelize: false

  load_and_authorize_model_with_id SignupRequest, :id, :accept

  def resolve(**_args)
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
