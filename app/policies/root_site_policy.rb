# frozen_string_literal: true
class RootSitePolicy < ApplicationPolicy
  def read?
    true
  end

  # Can't alter the root site unless you have a real session cookie and are not an identity assumer
  def manage?
    return false if assumed_identity_from_profile
    !doorkeeper_token && site_admin?
  end

  class Scope < Scope
    def resolve
      scope.all
    end
  end
end
