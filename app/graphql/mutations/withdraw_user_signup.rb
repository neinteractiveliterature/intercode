class Mutations::WithdrawUserSignup < Mutations::BaseMutation
  field :signup, Types::SignupType, null: false
  argument :run_id, Int, required: true, camelize: false
  argument :user_con_profile_id, Int, required: true, camelize: false
  argument :suppress_notifications, Boolean, required: false, camelize: false

  def resolve(run_id:, user_con_profile_id:, suppress_notifications: false)
    run = context[:convention].runs.find(run_id)
    signup = run.signups.where(user_con_profile_id: user_con_profile_id)
      .where.not(state: 'withdrawn')
      .first

    unless signup
      raise BetterRescueMiddleware::UnloggedError, "You are not signed up for #{run.event.title}."
    end

    EventWithdrawService.new(
      signup,
      context[:current_user],
      suppress_notifications: suppress_notifications,
      allow_non_self_service_signups: true
    ).call!

    { signup: signup }
  end
end
