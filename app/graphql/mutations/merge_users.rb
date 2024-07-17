# frozen_string_literal: true
class Mutations::MergeUsers < Mutations::BaseMutation
  field :user, Types::UserType, null: false

  argument :user_ids, [ID], required: false, description: "The user IDs to merge.", camelize: true
  argument :winning_user_con_profiles, [Types::WinningUserConProfileInputType], required: true
  argument :winning_user_id, ID, required: false, camelize: true

  define_authorization_check do |args|
    users = User.find(args[:user_ids])
    users.all? { |user| policy(user).merge? }
  end

  def resolve(winning_user_con_profiles:, user_ids: nil, winning_user_id: nil)
    winning_profile_ids_by_convention_id =
      winning_user_con_profiles
        .index_by { |winning_profile| winning_profile[:convention_id].to_i }
        .transform_values { |winning_profile| winning_profile[:user_con_profile_id].to_i }

    result =
      MergeUsersService.new(
        user_ids: user_ids&.map(&:to_i),
        winning_user_id: winning_user_id&.to_i,
        winning_user_con_profile_ids_by_convention_id: winning_profile_ids_by_convention_id
      ).call!

    { user: result.winning_user }
  end
end
