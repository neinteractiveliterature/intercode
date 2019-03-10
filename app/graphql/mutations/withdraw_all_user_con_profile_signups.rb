class Mutations::WithdrawAllUserConProfileSignups < Mutations::BaseMutation
  field :user_con_profile, Types::UserConProfileType, null: false, camelize: false

  argument :user_con_profile_id, Int, required: true, camelize: false

  def resolve(user_con_profile_id:)
    user_con_profile = context[:convention].user_con_profiles.find(user_con_profile_id)
    user_con_profile.signups.where.not(state: 'withdrawn').each do |signup|
      EventWithdrawService.new(signup, context[:current_user]).call!
    end

    { user_con_profile: user_con_profile.reload }
  end
end
