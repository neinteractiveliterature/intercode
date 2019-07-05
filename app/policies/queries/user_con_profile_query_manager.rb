class Queries::UserConProfileQueryManager < Queries::QueryManager
  def initialize(user:)
    super(user: user)
    @user_con_profiles = Queries::NilSafeCache.new
  end

  def user_con_profile_for_convention(convention)
    return nil unless convention && user

    @user_con_profiles.get(convention.id) do
      convention.user_con_profiles.find_by(convention_id: convention.id, user_id: user.id)
    end
  end
end
