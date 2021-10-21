# frozen_string_literal: true
class Mutations::MergeUsers < Mutations::BaseMutation
  field :user, Types::UserType, null: false

  argument :transitional_user_ids,
           [ID],
           required: false,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the userIds field so that \
we can remove this temporary one.",
           camelize: true
  argument :user_ids, [ID], required: false, description: 'The user IDs to merge.', camelize: true
  argument :transitional_winning_user_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the winningUserId field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :winning_user_id, ID, required: false, camelize: true
  argument :winning_user_con_profiles, [Types::WinningUserConProfileInputType], required: true

  define_authorization_check do |args|
    users = User.find(args[:transitional_user_ids] || args[:user_ids])
    users.all? { |user| policy(user).merge? }
  end

  def resolve(
    winning_user_con_profiles:,
    user_ids: nil,
    transitional_user_ids: nil,
    winning_user_id: nil,
    transitional_winning_user_id: nil
  )
    winning_profile_ids_by_convention_id =
      winning_user_con_profiles
        .index_by do |winning_profile|
          winning_profile[:transitional_convention_id]&.to_i || winning_profile[:convention_id]
        end
        .transform_values do |winning_profile|
          winning_profile[:transitional_user_con_profile_id]&.to_i || winning_profile[:user_con_profile_id]
        end

    result =
      MergeUsersService.new(
        user_ids: transitional_user_ids || user_ids,
        winning_user_id: transitional_winning_user_id || winning_user_id,
        winning_user_con_profile_ids_by_convention_id: winning_profile_ids_by_convention_id
      ).call!

    { user: result.winning_user }
  end
end
