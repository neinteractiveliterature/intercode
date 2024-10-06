# frozen_string_literal: true
class AuthorizationInfo
  QUERY_MANAGER_CLASSES = [
    Queries::PermissionsQueryManager,
    Queries::ScheduleReleaseQueryManager,
    Queries::SignupQueryManager,
    Queries::TeamMemberQueryManager,
    Queries::UserConProfileQueryManager
  ].freeze

  SCOPE_ALIASES = { email: :public, profile: :read_profile }.freeze

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

  attr_reader :user, :doorkeeper_token, :assumed_identity_from_profile
  QUERY_MANAGER_CLASSES.each do |query_manager_class|
    instance_variable_name = query_manager_class.name.demodulize.underscore.to_sym
    attr_reader instance_variable_name

    query_manager_class.query_methods.each { |query_method| delegate query_method, to: instance_variable_name }
  end

  def initialize(user, doorkeeper_token, assumed_identity_from_profile: nil, known_user_con_profiles: [])
    @user = user
    @assumed_identity_from_profile = assumed_identity_from_profile
    @doorkeeper_token = doorkeeper_token
    possible_query_manager_params = { user:, known_user_con_profiles:, authorization_info: self }

    QUERY_MANAGER_CLASSES.each do |query_manager_class|
      instance_variable_name = query_manager_class.name.demodulize.underscore.to_sym
      accepted_params = query_manager_class.instance_method(:initialize).parameters.map(&:second)
      init_params = possible_query_manager_params.slice(*accepted_params)
      query_manager = query_manager_class.new(**init_params)
      instance_variable_set(:"@#{instance_variable_name}", query_manager)
    end
  end

  def site_admin?
    !!(user && user.site_admin?)
  end

  def oauth_scope?(scope)
    resolved_scope = SCOPE_ALIASES[scope.to_sym] if SCOPE_ALIASES.key?(scope.to_sym)

    unless Doorkeeper.configuration.scopes.include?(resolved_scope.to_s)
      raise ArgumentError, "Invalid scope: #{resolved_scope}"
    end

    doorkeeper_token.nil? || doorkeeper_token.scopes.exists?(resolved_scope)
  end

  def oauth_scoped_disjunction(&)
    Queries::OAuthScopedDisjunction.evaluate(self, &)
  end

  def actual_user
    @actual_user ||= assumed_identity_from_profile ? assumed_identity_from_profile.user : user
  end
end
