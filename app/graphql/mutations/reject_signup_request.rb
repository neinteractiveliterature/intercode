# frozen_string_literal: true
class Mutations::RejectSignupRequest < Mutations::BaseMutation
  field :signup_request, Types::SignupRequestType, null: false

  argument :id,
           Int,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false,
           camelize: false
  argument :transitional_id, ID, required: false, camelize: true

  load_and_authorize_model_with_id SignupRequest, :id, :reject

  def resolve(**_args)
    signup_request.update!(state: 'rejected')

    { signup_request: signup_request }
  end
end
