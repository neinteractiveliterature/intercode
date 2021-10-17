# frozen_string_literal: true
class Mutations::AcceptSignupRequest < Mutations::BaseMutation
  field :signup, Types::SignupType, null: false
  field :signup_request, Types::SignupRequestType, null: false

  argument :id,
           Int,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false,
           camelize: false
  argument :transitional_id, ID, required: false, camelize: true

  load_and_authorize_model_with_id SignupRequest, :id, :accept

  def resolve(**_args)
    result = AcceptSignupRequestService.new(signup_request: signup_request, whodunit: current_user).call

    raise GraphQL::ExecutionError, result.errors.full_messages.join(', ') if result.failure?

    { signup: result.signup, signup_request: signup_request }
  end
end
