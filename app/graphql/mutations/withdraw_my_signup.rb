class Mutations::WithdrawMySignup < Mutations::BaseMutation
  field :signup, Types::SignupType, null: false
  argument :run_id, Int, required: true, camelize: false

  attr_reader :signup

  def authorized?(args)
    run = context[:convention].runs.find(args[:run_id])
    @signup = run.signups.where(user_con_profile_id: user_con_profile.id)
      .where.not(state: 'withdrawn')
      .first

    unless signup
      raise GraphQL::ExecutionError, "You are not signed up for #{run.event.title}."
    end

    policy(signup).withdraw?
  end

  def resolve(**_args)
    EventWithdrawService.new(signup, context[:current_user]).call!

    { signup: signup }
  end
end
