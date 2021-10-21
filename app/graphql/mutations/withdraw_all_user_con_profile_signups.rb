# frozen_string_literal: true
class Mutations::WithdrawAllUserConProfileSignups < Mutations::BaseMutation
  field :user_con_profile, Types::UserConProfileType, null: false, camelize: false

  argument :transitional_user_con_profile_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the userConProfileId field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :user_con_profile_id, ID, required: false, camelize: true

  attr_reader :user_con_profile

  def authorized?(args)
    @user_con_profile =
      convention.user_con_profiles.find(args[:transitional_user_con_profile_id] || args[:user_con_profile_id])
    self.class.check_authorization(policy(user_con_profile), :withdraw_all_signups)
  end

  def resolve(**_args)
    user_con_profile
      .signups
      .where.not(state: 'withdrawn')
      .each { |signup| EventWithdrawService.new(signup, current_user).call! }

    { user_con_profile: user_con_profile.reload }
  end
end
