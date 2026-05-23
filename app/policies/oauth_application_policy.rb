# frozen_string_literal: true
class OAuthApplicationPolicy < ApplicationPolicy
  # Only accessible by site admins via a cookie session or a token with the manage_intercode scope

  def read?
    oauth_scope?(:manage_intercode) && site_admin_read?
  end

  def manage?
    oauth_scope?(:manage_intercode) && site_admin_manage?
  end

  class Scope < Scope
    def resolve
      return scope.all if oauth_scope?(:manage_intercode) && user&.site_admin?

      scope.none
    end
  end
end
