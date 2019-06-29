class ApplicationPolicy
  AuthorizationInfo = Struct.new(:user, :doorkeeper_token) do
    def self.cast(authorization_info_or_user)
      if authorization_info_or_user.is_a?(AuthorizationInfo)
        authorization_info_or_user
      else
        AuthorizationInfo.new(authorization_info_or_user, nil)
      end
    end

    def site_admin?
      user&.site_admin?
    end

    def oauth_scope?(scope)
      doorkeeper_token.nil? || doorkeeper_token.scopes.exists?(scope)
    end
  end

  attr_reader :authorization_info, :record
  delegate :user, :doorkeeper_token, :site_admin?, :oauth_scope?, to: :authorization_info

  def initialize(authorization_info_or_user, record)
    @authorization_info = AuthorizationInfo.cast(authorization_info_or_user)
    @record = record
  end

  def read?
    site_admin?
  end

  def manage?
    site_admin?
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

  private

  def has_privilege_in_convention?(convention, *privileges)
    user_con_profile = convention.user_con_profiles.find_by(user_id: user.id)
    return false unless user_con_profile

    (
      user_con_profile.privileges.map(&:to_s) &
      ['site_admin', 'staff', *privileges.map(&:to_s)]
    ).any?
  end

  def staff_in_convention?(convention)
    has_privilege_in_convention?(convention)
  end

  class Scope
    attr_reader :authorization_info, :scope
    delegate :user, :doorkeeper_token, :site_admin?, :oauth_scope?, to: :authorization_info

    def initialize(authorization_info_or_user, scope)
      @authorization_info = AuthorizationInfo.cast(authorization_info_or_user)
      @scope = scope
    end

    def resolve
      scope.all
    end

    private

    def disjunctive_where(&block)
      Queries::DisjunctiveWhere.build(scope, &block)
    end

    def conventions_with_privilege(*privileges)
      return Convention.all if site_admin?

      user_con_profile_scope = UserConProfile.where(user_id: user.id)
        .has_privileges(['staff', *privileges.map(&:to_s)])

      Convention.where(user_con_profiles: user_con_profile_scope)
    end
  end
end
