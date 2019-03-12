class Mutations::WithdrawMySignup < Mutations::BaseMutation
  field :signup, Types::SignupType, null: false
  argument :run_id, Int, required: true, camelize: false

  def resolve(run_id:)
    run = context[:convention].runs.find(run_id)
    signup = run.signups.where(user_con_profile_id: context[:user_con_profile].id)
      .where.not(state: 'withdrawn')
      .first

    unless signup
      raise BetterRescueMiddleware::UnloggedError, "You are not signed up for #{run.event.title}."
    end

    EventWithdrawService.new(signup, context[:current_user]).call!

    { signup: signup }
  end
end
