# Used for authorizing actions on Conventions, natch.  This authorizer is also
# the base class for other authorizers because it contains the user_con_profile
# and staff_or_site_admin? methods, which are useful everywhere.
class ConventionAuthorizer < ApplicationAuthorizer
  
  # Anyone can read any convention.
  def readable_by?(user)
    true
  end

  def self.creatable_by?(user)
    user.site_admin?
  end
  
  # Only con staff or site admins can update a convention.
  def updatable_by?(user)
    staff_or_site_admin?(user)
  end
  
  # Pretty much does what it says on the tin... is the user a staff member for
  # this Convention, or a site admin?  If so, return true; otherwise return false.
  def staff_or_site_admin?(user)
    user.site_admin? || user_con_profile(user).try(:staff?)
  end
  
  # Given a user, attempts to find their UserConProfile and caches the result in
  # an instance variable.  
  def user_con_profile(user)
    @user_con_profile ||= convention.user_con_profiles.where(user: user).first
  end
  
  # Returns the current Convention.  In this case, that is the actual resource
  # that we're authorizing.  Subclasses should override this so the other
  # methods can find the Convention object.
  def convention
    resource
  end
end