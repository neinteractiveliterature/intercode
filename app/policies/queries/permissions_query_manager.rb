class Queries::PermissionsQueryManager < Queries::QueryManager
  def initialize(user:)
    super(user: user)
    @has_event_category_permission = Queries::NilSafeCache.new
  end

  def has_event_category_permission?(event_category_id, permission)
    return false unless event_category_id && permission && user

    @has_event_category_permission.get([event_category_id, permission]) do
      user_permission_scope.where(event_category_id: event_category_id, permission: permission).any?
    end
  end

  def events_where_has_event_category_permission(permission)
    Event.where(
      event_category_id: user_permission_scope.where(
        permission: permission
      ).select(:event_category_id)
    )
  end

  def organizations_with_permission(permission)
    Organization.where(
      id: user_organization_roles_with_permission(permission).select(:organization_id)
    )
  end

  def user_organization_roles_with_permission(permission)
    OrganizationRole.where(
      id: user_permission_scope.where(permission: permission)
        .where.not(organization_role_id: nil)
        .select(:organization_role_id)
    )
  end

  def conventions_with_organization_permission(permission)
    Convention.where(
      organization_id: user_organization_roles_with_permission(permission).select(:organization_id)
    )
  end

  def user_permission_scope
    @user_permission_scope ||= user ? Permission.for_user(user) : Permission.none
  end
end
