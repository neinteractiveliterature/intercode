# frozen_string_literal: true
class Mutations::WithdrawSignupRequest < Mutations::BaseMutation
  field :signup_request, Types::SignupRequestType, null: false

  argument :id,
           Int,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false
  argument :transitional_id, ID, required: false, camelize: true

  load_and_authorize_model_with_id SignupRequest, :id, :withdraw

  def resolve(**_args)
    signup_request.update!(state: 'withdrawn', updated_by: current_user)

    { signup_request: signup_request }
  end
end
