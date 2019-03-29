class Mutations::MergeUsers < Mutations::BaseMutation
  field :user, Types::UserType, null: false

  argument :user_ids, [Integer], required: true
  argument :winning_user_id, Integer, required: true
  argument :winning_user_con_profiles, [Types::WinningUserConProfileInputType], required: true

  def resolve(user_ids:, winning_user_id:, winning_user_con_profiles:)
    raise 'Winning user ID is not included in user IDs' unless user_ids.include?(winning_user_id)
    users = User.includes(user_con_profiles: :convention).find(user_ids)
    winning_user = users.find { |user| user.id == winning_user_id }
    winning_user.update!(site_admin: true) if users.any?(&:site_admin?)

    losing_user_ids = user_ids - [winning_user_id]

    winning_user_con_profiles.each do |winning_profile|
      next if users.any? { |user| user.user_con_profiles.any? { |profile| profile.id == winning_profile[:user_con_profile_id] } }
      raise "Can't find user con profile for ID #{winning_profile[:user_con_profile_id]}"
    end

    conventions = users.flat_map(&:user_con_profiles).flat_map(&:convention).uniq
    profiles_by_convention_id = conventions.index_by(&:id).transform_values do |convention|
      users.flat_map(&:user_con_profiles).select { |profile| profile.convention_id == convention.id }
    end
    ambiguous_convention_ids = profiles_by_convention_id
      .select { |convention_id, profiles| profiles.size > 1 }
      .keys
    winning_profile_ids_by_convention_id = winning_user_con_profiles
      .index_by { |winning_profile| winning_profile[:convention_id] }
      .transform_values { |winning_profile| winning_profile[:user_con_profile_id] }
    winning_profiles_by_convention_id = profiles_by_convention_id.transform_values do |profiles|
      profiles.find { |profile| profile.id == winning_profile_ids_by_convention_id[profile.convention.id] }
    end
    fully_disambiguated = ambiguous_convention_ids.all? do |convention_id|
      disambiguators = winning_user_con_profiles.select do |winning_profile|
        winning_profile[:convention_id] == convention_id
      end

      disambiguators.size == 1
    end
    raise 'Not fully disambiguated' unless fully_disambiguated

    users.each do |user|
      user.user_con_profiles.each do |profile|
        next if profiles_by_convention_id[profile.convention_id].size < 2

        winning_profile_for_convention = winning_profiles_by_convention_id[profile.convention_id]
        profile_is_winner = winning_profile_for_convention.id == profile.id
        next if profile_is_winner

        profile.orders.update_all(user_con_profile_id: winning_profile_for_convention.id)
        profile.destroy!
      end
    end

    CmsFile.where(uploader_id: losing_user_ids).update_all(uploader_id: winning_user_id)
    Convention.where(updated_by_id: losing_user_ids).update_all(updated_by_id: winning_user_id)
    Event.where(updated_by_id: losing_user_ids).update_all(updated_by_id: winning_user_id)
    Event.where(owner_id: losing_user_ids).update_all(owner_id: winning_user_id)
    Run.where(updated_by_id: losing_user_ids).update_all(updated_by_id: winning_user_id)
    Signup.where(updated_by_id: losing_user_ids).update_all(updated_by_id: winning_user_id)
    UserActivityAlert.where(user_id: losing_user_ids).update_all(user_id: winning_user_id)

    UserConProfile
      .where(id: winning_user_con_profiles.map { |winning_profile| winning_profile[:user_con_profile_id] })
      .update_all(user_id: winning_user_id)

    users.each do |user|
      user.destroy! unless user == winning_user
    end

    { user: winning_user.reload }
  end
end
