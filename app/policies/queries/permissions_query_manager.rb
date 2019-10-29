class Queries::PermissionsQueryManager < Queries::QueryManager
  def initialize(user:)
    super(user: user)
    @convention_permissions = Queries::NilSafeCache.new
    @has_convention_permission = Queries::NilSafeCache.new
    @has_event_category_permission = Queries::NilSafeCache.new
    @has_event_category_permission_in_convention = Queries::NilSafeCache.new
    @has_organization_permission = Queries::NilSafeCache.new
  end

  def has_event_category_permission?(event_category_id, *permissions)
    return false unless event_category_id && permissions.present? && user

    @has_event_category_permission.get([event_category_id, permissions]) do
      user_permission_scope.where(event_category_id: event_category_id, permission: permissions)
        .any?
    end
  end

  def event_categories_with_permission(*permissions)
    EventCategory.where(
      id: user_permission_scope.where(
        permission: permissions
      ).select(:event_category_id)
    )
  end

  def has_event_category_permission_in_convention?(convention, *permissions)
    return false unless convention && permissions.present? && user

    @has_event_category_permission_in_convention.get([convention.id, permissions]) do
      event_categories_with_permission(*permissions).where(convention_id: convention.id).any?
    end
  end

  def events_where_has_event_category_permission(*permissions)
    Event.where(event_category_id: event_categories_with_permission(*permissions))
  end

  def event_proposals_where_has_event_category_permission(*permissions)
    EventProposal.where(event_category_id: event_categories_with_permission(*permissions))
  end

  def convention_permissions(convention)
    return [] unless convention && user

    @convention_permissions.get(convention.id) do
      Set.new(user_permission_scope.where(convention_id: convention.id).pluck(:permission))
    end
  end

  def has_convention_permission?(convention, *permissions)
    return false unless convention && permissions.present? && user

    user_permissions = convention_permissions(convention)
    permissions.any? { |permission| user_permissions.include?(permission.to_s) }
  end

  def conventions_with_permission(*permissions)
    Convention.where(
      id: user_permission_scope.where(
        permission: permissions
      ).select(:convention_id)
    )
  end

  def cms_content_groups_with_permission(*permissions)
    CmsContentGroup.where(
      id: user_permission_scope.where(
        permission: permissions
      ).select(:cms_content_group_id)
    )
  end

  def has_organization_permission?(organization_id, *permissions)
    return false unless organization_id && permissions.present? && user

    @has_organization_permission.get([organization_id, permissions]) do
      organizations_with_permission(*permissions).where(id: organization_id).any?
    end
  end

  def organizations_with_permission(*permissions)
    Organization.where(
      id: user_organization_roles_with_permission(*permissions).select(:organization_id)
    )
  end

  def user_organization_roles_with_permission(*permissions)
    OrganizationRole.where(
      id: user_permission_scope.where(permission: permissions)
        .where.not(organization_role_id: nil)
        .select(:organization_role_id)
    )
  end

  def conventions_with_organization_permission(*permissions)
    Convention.where(
      organization_id: user_organization_roles_with_permission(*permissions).select(:organization_id)
    )
  end

  def user_permission_scope
    @user_permission_scope ||= user ? Permission.for_user(user) : Permission.none
  end
end
