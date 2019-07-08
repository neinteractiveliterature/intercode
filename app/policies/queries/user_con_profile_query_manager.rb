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

  def has_privilege_in_convention?(convention, *privileges)
    user_con_profile = user_con_profile_for_convention(convention)
    return false unless user_con_profile

    (
      user_con_profile.privileges.map(&:to_s) &
      ['site_admin', 'staff', *privileges.map(&:to_s)]
    ).any?
  end

  def staff_in_convention?(convention)
    has_privilege_in_convention?(convention)
  end

  def conventions_with_privilege(*privileges)
    return Convention.all if user&.site_admin?

    user_con_profile_scope = UserConProfile.where(user_id: user.id)
      .has_privileges(['staff', *privileges.map(&:to_s)])

    Convention.where(user_con_profiles: user_con_profile_scope)
  end

  def conventions_where_staff
    conventions_with_privilege # staff is implicitly included
  end
end
