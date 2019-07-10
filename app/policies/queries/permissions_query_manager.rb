class Queries::PermissionsQueryManager < Queries::QueryManager
  def initialize(user:)
    super(user: user)
    @has_event_category_permission = Queries::NilSafeCache.new
    @has_event_category_permission_in_convention = Queries::NilSafeCache.new
    @has_organization_permission = Queries::NilSafeCache.new
  end

  def has_event_category_permission?(event_category_id, permission)
    return false unless event_category_id && permission && user

    @has_event_category_permission.get([event_category_id, permission]) do
      user_permission_scope.where(event_category_id: event_category_id, permission: permission).any?
    end
  end

  def event_categories_with_permission(permission)
    EventCategory.where(
      id: user_permission_scope.where(
        permission: permission
      ).select(:event_category_id)
    )
  end

  def has_event_category_permission_in_convention?(convention, permission)
    return false unless convention && permission && user

    @has_event_category_permission_in_convention.get([convention.id, permission]) do
      event_categories_with_permission(permission).where(convention_id: convention.id).any?
    end
  end

  def events_where_has_event_category_permission(permission)
    Event.where(event_category_id: event_categories_with_permission(permission))
  end

  def event_proposals_where_has_event_category_permission(permission)
    EventProposal.where(event_category_id: event_categories_with_permission(permission))
  end

  def has_organization_permission?(organization_id, permission)
    return false unless organization_id && permission && user

    @has_organization_permission.get([organization_id, permission]) do
      organizations_with_permission(permission).where(id: organization_id).any?
    end
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
