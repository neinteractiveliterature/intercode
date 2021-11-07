# frozen_string_literal: true
class Mutations::WithdrawUserSignup < Mutations::BaseMutation
  field :signup, Types::SignupType, null: false
  argument :transitional_run_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the runId field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :run_id, ID, required: false, camelize: true
  argument :transitional_user_con_profile_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the userConProfileId field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :user_con_profile_id, ID, required: false, camelize: true
  argument :suppress_notifications, Boolean, required: false, camelize: false

  attr_reader :signup

  define_authorization_check do |args|
    run = convention.runs.find(args[:transitional_run_id] || args[:run_id])
    @signup =
      run
        .signups
        .where(user_con_profile_id: args[:transitional_user_con_profile_id] || args[:user_con_profile_id])
        .where.not(state: 'withdrawn')
        .first

    raise GraphQL::ExecutionError, "That user is not signed up for #{run.event.title}." unless signup

    policy(signup).withdraw?
  end

  def resolve(**args)
    EventWithdrawService.new(signup, context[:current_user], suppress_notifications: args[:suppress_notifications])
      .call!

    { signup: signup }
  end
end
