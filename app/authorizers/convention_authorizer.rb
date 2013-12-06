class ConventionAuthorizer < ApplicationAuthorizer
  def readable_by?(user)
    true
  end

  def updatable_by?(user)
    staff_or_site_admin?(user)
  end
  
  def staff_or_site_admin?(user)
    user.site_admin? || user_con_profile.staff?
  end
  
  def user_con_profile(user)
    @user_con_profile ||= convention.user_con_profiles.where(user: user).first
  end
  
  def convention
    resource
  end
end