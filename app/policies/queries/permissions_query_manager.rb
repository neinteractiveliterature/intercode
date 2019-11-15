class Queries::PermissionsQueryManager < Queries::QueryManager
  def initialize(user:)
    super(user: user)
    @all_model_permissions_in_convention = Queries::NilSafeCache.new
    @has_organization_permission = Queries::NilSafeCache.new
  end

  def all_model_permissions_in_convention(convention)
    return {} unless convention && user

    @all_model_permissions_in_convention.get(convention.id) do
      select_all_permissions_in_convention_with_model_type_and_id(convention)
        .group_by { |(_permission, model_type, _model_id)| model_type }
        .transform_values do |model_type_rows|
          rows_by_model_id = model_type_rows
            .group_by { |(_permission, _model_type, model_id)| model_id }

          rows_by_model_id.transform_values do |model_id_rows|
            Set.new(model_id_rows.map { |(permission, _model_type, _model_id)| permission })
          end
        end
    end
  end

  def all_model_permissions_in_convention_for_model_type(convention, model_type)
    all_model_permissions_in_convention(convention)[model_type] || {}
  end

  def all_model_permissions(model_type, model)
    user_permissions = all_model_permissions_in_convention_for_model_type(
      convention_for_model(model_type, model),
      model_type
    )

    user_permissions[model.id] || Set.new
  end

  Permission.model_exclusive_arc.model_classes.each do |model_class|
    association_name = Permission.model_exclusive_arc.association_name(model_class)
    model_type = association_name.to_sym

    define_method "#{association_name.pluralize}_with_permission" do |*permissions|
      model_class.where(
        id: user_permission_scope.where(
          permission: permissions
        ).select(:"#{association_name}_id")
      )
    end

    define_method "#{association_name}_ids_with_permission_in_convention" do |convention, *permissions|
      permission_sets = all_model_permissions_in_convention_for_model_type(convention, model_type)
      return [] unless permission_sets.present?

      permission_sets.select do |_model_id, permission_set|
        permissions.any? { |permission| permission_set.include?(permission.to_s) }
      end.keys
    end

    define_method "#{association_name}_permissions" do |model|
      all_model_permissions(model_type, model)
    end

    define_method "has_#{association_name}_permission_in_convention?" do |convention, *permissions|
      permission_sets = all_model_permissions_in_convention_for_model_type(convention, model_type)
        .values
      return false unless permission_sets.present?

      user_permissions = permission_sets.inject(&:+)
      permissions.any? { |permission| user_permissions.include?(permission.to_s) }
    end

    define_method "has_#{association_name}_permission?" do |model, *permissions|
      return false unless model && permissions.present? && user

      user_permissions = all_model_permissions(model_type, model)
      permissions.any? { |permission| user_permissions.include?(permission.to_s) }
    end
  end

  def events_where_has_event_category_permission(*permissions)
    Event.where(event_category_id: event_categories_with_permission(*permissions))
  end

  def event_proposals_where_has_event_category_permission(*permissions)
    EventProposal.where(event_category_id: event_categories_with_permission(*permissions))
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

  private

  def select_all_permissions_in_convention(convention)
    convention_where_clause = <<~SQL
        convention_id = ?
        OR event_category_id IN (
          #{convention.event_categories.select(:id).to_sql}
        )
        OR cms_content_group_id IN (
          #{convention.cms_content_groups.select(:id).to_sql}
        )
      SQL

    user_permission_scope.where(convention_where_clause, convention.id)
  end

  def select_all_permissions_in_convention_with_model_type_and_id(convention)
    sql_rows = select_all_permissions_in_convention(convention)
      .pluck(:permission, :convention_id, :event_category_id, :cms_content_group_id)

    sql_rows.map do |(permission, convention_id, event_category_id, cms_content_group_id)|
      (model_type, model_id) = if convention_id
        [:convention, convention_id]
      elsif event_category_id
        [:event_category, event_category_id]
      elsif cms_content_group_id
        [:cms_content_group, cms_content_group_id]
      end

      [permission, model_type, model_id]
    end
  end

  def convention_for_model(model_type, model)
    return model if model_type == :convention
    model.convention
  end
end
