class AuthorizationInfo
  QUERY_MANAGER_CLASSES = [
    Queries::PermissionsQueryManager,
    Queries::SignupQueryManager,
    Queries::TeamMemberQueryManager,
    Queries::UserConProfileQueryManager
  ]

  module QueryMethods
    METHODS = AuthorizationInfo::QUERY_MANAGER_CLASSES.flat_map(&:query_methods)
    delegate(*METHODS, to: :authorization_info)
    delegate :site_admin?, to: :authorization_info
  end

  def self.cast(authorization_info_or_user)
    if authorization_info_or_user.is_a?(AuthorizationInfo)
      authorization_info_or_user
    else
      AuthorizationInfo.new(authorization_info_or_user, nil)
    end
  end

  attr_reader :user, :doorkeeper_token
  QUERY_MANAGER_CLASSES.each do |query_manager_class|
    instance_variable_name = query_manager_class.name.demodulize.underscore.to_sym
    attr_reader instance_variable_name

    query_manager_class.query_methods.each do |query_method|
      delegate query_method, to: instance_variable_name
    end
  end

  def initialize(user, doorkeeper_token, known_user_con_profiles: [])
    @user = user
    @doorkeeper_token = doorkeeper_token
    possible_query_manager_params = { user: user, known_user_con_profiles: known_user_con_profiles }

    QUERY_MANAGER_CLASSES.each do |query_manager_class|
      instance_variable_name = query_manager_class.name.demodulize.underscore.to_sym
      accepted_params = query_manager_class.instance_method(:initialize).parameters.map(&:second)
      init_params = possible_query_manager_params.slice(*accepted_params)
      query_manager = query_manager_class.new(**init_params)
      instance_variable_set(:"@#{instance_variable_name}", query_manager)
    end
  end

  def site_admin?
    user&.site_admin?
  end

  def oauth_scope?(scope)
    doorkeeper_token.nil? || doorkeeper_token.scopes.exists?(scope)
  end

  def oauth_scoped_disjunction(&block)
    Queries::OAuthScopedDisjunction.evaluate(self, &block)
  end
end
