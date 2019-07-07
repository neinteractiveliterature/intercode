class Mutations::WithdrawAllUserConProfileSignups < Mutations::BaseMutation
  field :user_con_profile, Types::UserConProfileType, null: false, camelize: false

  argument :user_con_profile_id, Int, required: true, camelize: false

  load_and_authorize_convention_associated_model :user_con_profiles, :user_con_profile_id,
    :withdraw_all_signups

  def resolve(**_args)
    user_con_profile.signups.where.not(state: 'withdrawn').each do |signup|
      EventWithdrawService.new(signup, current_user).call!
    end

    { user_con_profile: user_con_profile.reload }
  end
end
