# frozen_string_literal: true
class ApplicationPolicy
  include AuthorizationInfo::QueryMethods

  attr_reader :authorization_info, :record
  delegate :user,
           :doorkeeper_token,
           :assumed_identity_from_profile,
           :oauth_scope?,
           :oauth_scoped_disjunction,
           :actual_user,
           to: :authorization_info

  def initialize(authorization_info_or_user, record)
    @authorization_info = AuthorizationInfo.cast(authorization_info_or_user)
    @record = record
  end

  # Is the given user_con_profile (typically the owner of the record being authorized) the current user?
  #
  # Always use this instead of comparing user IDs by hand.  An identity assumer acts as another user in only
  # one convention, so they must not be treated as the owner of anything in a different convention.  Checks
  # that go through has_convention_permission? get that behavior from the query managers, but raw comparisons
  # of user IDs don't.
  def owned_by_user?(user_con_profile)
    return false unless user && user_con_profile
    if assumed_identity_from_profile && assumed_identity_from_profile.convention_id != user_con_profile.convention_id
      return false
    end

    user_con_profile.user_id == user.id
  end

  def site_admin_read?
    oauth_scope?(:read_conventions) && site_admin?
  end

  def site_admin_manage?
    oauth_scope?(:manage_conventions) && site_admin?
  end

  def read?
    site_admin_read?
  end

  def manage?
    site_admin_manage?
  end

  def create?
    manage?
  end

  def update?
    manage?
  end

  def destroy?
    manage?
  end

  class Scope
    include AuthorizationInfo::QueryMethods

    attr_reader :authorization_info, :scope
    delegate :user, :doorkeeper_token, :assumed_identity_from_profile, :oauth_scope?, to: :authorization_info

    def initialize(authorization_info_or_user, scope)
      @authorization_info = AuthorizationInfo.cast(authorization_info_or_user)
      @scope = scope
    end

    def resolve
      oauth_scope?(:read_conventions) && site_admin? ? scope.all : scope.none
    end

    private

    def disjunctive_where(&)
      Queries::DisjunctiveWhere.build(scope, &)
    end
  end
end
