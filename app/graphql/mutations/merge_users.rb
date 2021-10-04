# frozen_string_literal: true
class Mutations::MergeUsers < Mutations::BaseMutation
  field :user, Types::UserType, null: false

  argument :user_ids,
           [Integer],
           required: false,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.'
  argument :transitional_user_ids, [ID], required: false, description: 'The user IDs to merge.'
  argument :winning_user_id,
           Integer,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false
  argument :transitional_winning_user_id, ID, required: false
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
