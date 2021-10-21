# frozen_string_literal: true
class Mutations::WithdrawSignupRequest < Mutations::BaseMutation
  field :signup_request, Types::SignupRequestType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false

  load_and_authorize_model_with_id SignupRequest, :id, :withdraw

  def resolve(**_args)
    signup_request.update!(state: 'withdrawn', updated_by: current_user)

    { signup_request: signup_request }
  end
end
