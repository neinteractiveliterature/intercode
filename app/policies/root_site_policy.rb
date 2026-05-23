# frozen_string_literal: true
class RootSitePolicy < ApplicationPolicy
  def read?
    true
  end

  # Can't alter the root site unless you are not an identity assumer,
  # and either have a real session cookie or a token with the manage_intercode scope
  def manage?
    return false if assumed_identity_from_profile
    oauth_scope?(:manage_intercode) && site_admin?
  end

  class Scope < Scope
    def resolve
      scope.all
    end
  end
end
