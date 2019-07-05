module Ability::EventCategoryPermissions
  def add_event_category_permission_abilities
    if has_scope?(:read_events)
      event_category_authorization :read, EventProposal, 'read_event_proposals',
        model_conditions: { status: Ability::EVENT_PROPOSAL_NON_DRAFT_STATUSES - ['proposed'] }
      event_category_authorization :read, EventProposal, 'read_pending_event_proposals',
        model_conditions: { status: Ability::EVENT_PROPOSAL_NON_DRAFT_STATUSES }
      event_category_authorization(
        token_scope_action(:manage_events, :read_admin_notes, :update_admin_notes),
        EventProposal,
        'access_admin_notes'
      )
    end

    if has_scope?(:manage_events)
      event_category_authorization :update, EventProposal, 'update_event_proposals',
        model_conditions: { status: Ability::EVENT_PROPOSAL_NON_DRAFT_STATUSES }
    end

    if has_scope?(:read_conventions)
      read_event_proposals_staff_positions = StaffPosition.where(
        id: user_permission_scope.where(permission: 'read_event_proposals').select(:staff_position_id)
      )

      event_category_authorization :read_admin_notes, Event, 'access_admin_notes'
      scope_authorization [:read, :read_personal_info], UserConProfile, UserConProfile.where(
        convention_id: read_event_proposals_staff_positions.select(:convention_id)
      ) do |user_con_profile|
        read_event_proposals_staff_positions.where(
          convention_id: user_con_profile.convention_id
        ).any?
      end
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
