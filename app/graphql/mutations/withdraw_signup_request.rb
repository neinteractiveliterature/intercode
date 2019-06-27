class Mutations::WithdrawSignupRequest < Mutations::BaseMutation
  field :signup_request, Types::SignupRequestType, null: false

  argument :id, Int, required: true

  def resolve(id:)
    signup_request = SignupRequest.find(id)
    signup_request.update!(state: 'withdrawn', updated_by: current_user)

    { signup_request: signup_request }
  end
end
