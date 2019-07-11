class Doorkeeper::ApplicationPolicy < ApplicationPolicy
  # Only accessible by site admins, and only with a real cookie session (so no doorkeeper_token)

  def read?
    return false if doorkeeper_token

    site_admin_read?
  end

  def manage?
    return false if doorkeeper_token

    site_admin_manage?
  end

  class Scope < Scope
    def resolve
      return scope.all if user&.site_admin? && !doorkeeper_token

      scope.none
    end
  end
end
