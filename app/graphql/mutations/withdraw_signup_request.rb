# frozen_string_literal: true
class Mutations::WithdrawSignupRequest < Mutations::BaseMutation
  field :signup_request, Types::SignupRequestType, null: false

  argument :id, Int, required: true

  load_and_authorize_model_with_id SignupRequest, :id, :withdraw

  def resolve(**_args)
    signup_request.update!(state: 'withdrawn', updated_by: current_user)

    { signup_request: signup_request }
  end
end
