# frozen_string_literal: true
class Mutations::WithdrawMySignup < Mutations::BaseMutation
  field :signup, Types::SignupType, null: false
  argument :run_id,
           Int,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false,
           camelize: false
  argument :transitional_run_id, ID, required: false, camelize: true

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
