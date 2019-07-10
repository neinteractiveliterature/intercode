module Ability::EventCategoryPermissions
  def add_event_category_permission_abilities
    if has_scope?(:read_conventions)
      event_category_authorization :read_admin_notes, Event, 'access_admin_notes'
    end

    if has_scope?(:manage_conventions)
      event_category_authorization :manage, Event, 'update_events'
    end
  end

  private

  def event_category_authorization(action, model_class, permission, model_conditions: {})
    scope = model_class.where(
      event_category_id: user_permission_scope
        .where(permission: permission).select(:event_category_id),
      **model_conditions
    )

    scope_authorization(action, model_class, scope) do |model|
      (
        model_conditions.all? do |key, value|
          model_value = model.public_send(key)

          case value
          when Array then value.include?(model_value)
          else value == model_value
          end
        end &&
        user_permission_scope.where(permission: permission).where(event_category_id: model.event_category_id).any?
      )
    end
  end
end
