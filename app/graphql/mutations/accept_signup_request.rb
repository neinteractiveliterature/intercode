# frozen_string_literal: true
class Mutations::AcceptSignupRequest < Mutations::BaseMutation
  field :signup, Types::SignupType, null: false
  field :signup_request, Types::SignupRequestType, null: false

  argument :id, ID, required: false

  load_and_authorize_model_with_id SignupRequest, :id, :accept

  def resolve(**_args)
    result = AcceptSignupRequestService.new(signup_request:, whodunit: current_user).call

    raise GraphQL::ExecutionError, result.errors.full_messages.join(", ") if result.failure?

    { signup: result.signup, signup_request: }
  end
end
