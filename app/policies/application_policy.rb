class ApplicationPolicy
  include AuthorizationInfo::QueryMethods

  attr_reader :authorization_info, :record
  delegate :user, :doorkeeper_token, :oauth_scope?, :oauth_scoped_disjunction,
    to: :authorization_info

  def initialize(authorization_info_or_user, record)
    @authorization_info = AuthorizationInfo.cast(authorization_info_or_user)
    @record = record
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
    delegate :user, :doorkeeper_token, :oauth_scope?, to: :authorization_info

    def initialize(authorization_info_or_user, scope)
      @authorization_info = AuthorizationInfo.cast(authorization_info_or_user)
      @scope = scope
    end

    def resolve
      if oauth_scope?(:read_conventions) && site_admin?
        scope.all
      else
        scope.none
      end
    end

    private

    def disjunctive_where(&block)
      Queries::DisjunctiveWhere.build(scope, &block)
    end
  end
end
