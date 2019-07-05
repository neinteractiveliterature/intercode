class AuthorizationInfo
  class NilSafeCache
    def initialize
      @values = {}
    end

    def get(key, &block)
      return @values[key] if @values.key?(key)
      @values[key] = block.call
    end
  end

  class OAuthScopedDisjunction
    def self.evaluate(authorization_info)
      disjunction = new(authorization_info)
      yield disjunction
      disjunction.value
    end

    attr_reader :authorization_info

    def initialize(authorization_info)
      @authorization_info = authorization_info
      @clauses = []
    end

    def add_clause(&block)
      @clauses << block
    end

    def add(scope, &block)
      add_clause { authorization_info.oauth_scope?(scope) && block.call }
    end

    def value
      @clauses.any?(&:call)
    end
  end

  def self.cast(authorization_info_or_user)
    if authorization_info_or_user.is_a?(AuthorizationInfo)
      authorization_info_or_user
    else
      AuthorizationInfo.new(authorization_info_or_user, nil)
    end
  end

  attr_reader :user, :doorkeeper_token

  def initialize(user, doorkeeper_token)
    @user = user
    @doorkeeper_token = doorkeeper_token
    @user_con_profiles = NilSafeCache.new
    @team_member_in_convention = NilSafeCache.new
  end

  def user_con_profile_for_convention(convention)
    return nil unless convention && user

    @user_con_profiles.get(convention.id) do
      convention.user_con_profiles.find_by(convention_id: convention.id, user_id: user.id)
    end
  end

  def team_member_in_convention?(convention)
    return false unless convention

    @team_member_in_convention.get(convention.id) do
      TeamMember.joins(:user_con_profile)
        .where(user_con_profiles: { user_id: user.id, convention_id: convention.id })
        .any?
    end
  end

  def site_admin?
    user&.site_admin?
  end

  def oauth_scope?(scope)
    doorkeeper_token.nil? || doorkeeper_token.scopes.exists?(scope)
  end

  def oauth_scoped_disjunction(&block)
    OAuthScopedDisjunction.evaluate(self, &block)
  end

  def user_permission_scope
    @user_permission_scope ||= user ? Permission.for_user(user) : Permission.none
  end
end
