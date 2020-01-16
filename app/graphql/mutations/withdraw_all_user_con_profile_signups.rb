class Mutations::WithdrawAllUserConProfileSignups < Mutations::BaseMutation
  field :user_con_profile, Types::UserConProfileType, null: false, camelize: false

  argument :user_con_profile_id, Int, required: true, camelize: false

  attr_reader :user_con_profile

  def authorized?(args)
    @user_con_profile = convention.user_con_profiles.find(args[:user_con_profile_id])
    self.class.check_authorization(policy(user_con_profile), :withdraw_all_signups)
  end

  def resolve(**_args)
    user_con_profile.signups.where.not(state: 'withdrawn').each do |signup|
      EventWithdrawService.new(signup, current_user).call!
    end

    { user_con_profile: user_con_profile.reload }
  end
end
