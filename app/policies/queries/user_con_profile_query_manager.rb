# frozen_string_literal: true
class Queries::UserConProfileQueryManager < Queries::QueryManager
  def initialize(user:, authorization_info:, known_user_con_profiles: [])
    super(user: user)
    @authorization_info = authorization_info
    @user_con_profiles = Queries::NilSafeCache.new

    known_user_con_profiles.each do |user_con_profile|
      next if user_con_profile.nil?

      @user_con_profiles.get(user_con_profile.convention_id) { user_con_profile }
    end
  end

  def user_con_profile_for_convention(convention)
    return nil unless convention && user
    if @authorization_info.assumed_identity_from_profile &&
         @authorization_info.assumed_identity_from_profile.convention != convention
      return nil
    end

    @user_con_profiles.get(convention.id) do
      convention.user_con_profiles.find_by(convention_id: convention.id, user_id: user.id)
    end
  end
end
