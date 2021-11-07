# frozen_string_literal: true
class Mutations::WithdrawMySignup < Mutations::BaseMutation
  field :signup, Types::SignupType, null: false
  argument :transitional_run_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the runId field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :run_id, ID, required: false, camelize: true

  attr_reader :signup

  define_authorization_check do |args|
    run = context[:convention].runs.find(args[:transitional_run_id] || args[:run_id])
    @signup = run.signups.where(user_con_profile_id: user_con_profile.id).where.not(state: 'withdrawn').first

    raise GraphQL::ExecutionError, "You are not signed up for #{run.event.title}." unless signup

    policy(signup).withdraw?
  end

  def resolve(**_args)
    EventWithdrawService.new(signup, context[:current_user]).call!

    { signup: signup }
  end
end
