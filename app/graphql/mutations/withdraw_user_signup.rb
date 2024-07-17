# frozen_string_literal: true
class Mutations::WithdrawUserSignup < Mutations::BaseMutation
  field :signup, Types::SignupType, null: false
  argument :run_id, ID, required: false, camelize: true
  argument :suppress_confirmation, Boolean, required: false, camelize: false
  argument :suppress_notifications, Boolean, required: false, camelize: false
  argument :user_con_profile_id, ID, required: false, camelize: true

  attr_reader :signup

  define_authorization_check do |args|
    run = convention.runs.find(args[:run_id])
    @signup = run.signups.where(user_con_profile_id: args[:user_con_profile_id]).where.not(state: "withdrawn").first

    raise GraphQL::ExecutionError, "That user is not signed up for #{run.event.title}." unless signup

    policy(signup).withdraw?
  end

  def resolve(**args)
    EventWithdrawService.new(
      signup,
      context[:current_user],
      suppress_notifications: args[:suppress_notifications],
      suppress_confirmation: args[:suppress_confirmation]
    ).call!

    { signup: }
  end
end
