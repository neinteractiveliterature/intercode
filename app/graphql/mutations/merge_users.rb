class Mutations::MergeUsers < Mutations::BaseMutation
  field :user, Types::UserType, null: false

  argument :user_ids, [Integer], required: true
  argument :winning_user_id, Integer, required: true
  argument :winning_user_con_profiles, [Types::WinningUserConProfileInputType], required: true

  define_authorization_check do |args|
    users = User.find(args[:user_ids])
    users.all? { |user| policy(user).merge? }
  end

  def resolve(user_ids:, winning_user_id:, winning_user_con_profiles:)
    winning_profile_ids_by_convention_id = winning_user_con_profiles
      .index_by(&:convention_id)
      .transform_values(&:user_con_profile_id)

    result = MergeUsersService.new(
      user_ids: user_ids,
      winning_user_id: winning_user_id,
      winning_user_con_profile_ids_by_convention_id: winning_profile_ids_by_convention_id
    ).call!

    { user: result.winning_user }
  end
end
