class RootSitePolicy < ApplicationPolicy
  def read?
    true
  end

  # Can't alter the root site unless you have a real session cookie
  def manage?
    !doorkeeper_token && site_admin?
  end

  class Scope < Scope
    def resolve
      scope.all
    end
  end
end
