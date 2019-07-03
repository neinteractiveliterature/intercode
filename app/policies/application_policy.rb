class ApplicationPolicy
  attr_reader :authorization_info, :record
  delegate :user, :doorkeeper_token, :site_admin?, :oauth_scope?,
    :user_con_profile_for_convention, :team_member_in_convention?,
    :oauth_scoped_disjunction,
    to: :authorization_info

  def initialize(authorization_info_or_user, record)
    @authorization_info = AuthorizationInfo.cast(authorization_info_or_user)
    @record = record
  end

  def read?
    oauth_scope?(:read_conventions) && site_admin?
  end

  def manage?
    oauth_scope?(:manage_conventions) && site_admin?
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
    user_con_profile = user_con_profile_for_convention(convention)
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

    def conventions_where_team_member
      Convention.where(
        id: TeamMember
          .joins(:user_con_profile)
          .where(user_con_profiles: { user_id: user.id })
          .select(:convention_id)
      )
    end
  end
end
