class Queries::UserConProfileQueryManager < Queries::QueryManager
  def initialize(user:, known_user_con_profiles: [])
    super(user: user)
    @user_con_profiles = Queries::NilSafeCache.new

    known_user_con_profiles.each do |user_con_profile|
      next if user_con_profile.nil?

      @user_con_profiles.get(user_con_profile.convention_id) do
        user_con_profile
      end
    end
  end

  def user_con_profile_for_convention(convention)
    return nil unless convention && user

    @user_con_profiles.get(convention.id) do
      convention.user_con_profiles.find_by(convention_id: convention.id, user_id: user.id)
    end
  end
end
