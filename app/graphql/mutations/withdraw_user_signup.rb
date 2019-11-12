class Mutations::WithdrawUserSignup < Mutations::BaseMutation
  field :signup, Types::SignupType, null: false
  argument :run_id, Int, required: true, camelize: false
  argument :user_con_profile_id, Int, required: true, camelize: false
  argument :suppress_notifications, Boolean, required: false, camelize: false

  attr_reader :signup

  define_authorization_check do |args|
    run = convention.runs.find(args[:run_id])
    @signup = run.signups.where(user_con_profile_id: args[:user_con_profile_id])
      .where.not(state: 'withdrawn')
      .first

    unless signup
      raise GraphQL::ExecutionError, "That user is not signed up for #{run.event.title}."
    end

    policy(signup).withdraw?
  end

  def resolve(**args)
    EventWithdrawService.new(
      signup,
      context[:current_user],
      suppress_notifications: args[:suppress_notifications]
    ).call!

    { signup: signup }
  end
end
