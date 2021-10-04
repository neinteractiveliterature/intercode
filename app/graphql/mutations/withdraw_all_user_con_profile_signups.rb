# frozen_string_literal: true
class Mutations::WithdrawAllUserConProfileSignups < Mutations::BaseMutation
  field :user_con_profile, Types::UserConProfileType, null: false, camelize: false

  argument :user_con_profile_id,
           Int,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false,
           camelize: false
  argument :transitional_user_con_profile_id, ID, required: false, camelize: true

  attr_reader :user_con_profile

  def authorized?(args)
    @user_con_profile = convention.user_con_profiles.find(args[:user_con_profile_id])
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
