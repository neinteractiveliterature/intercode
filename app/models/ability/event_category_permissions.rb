module Ability::EventCategoryPermissions
  def add_event_category_permission_abilities
    if has_scope?(:read_events)
      event_category_authorization :read, EventProposal,
        model_conditions: { status: Ability::EVENT_PROPOSAL_NON_DRAFT_STATUSES - ['proposed'] }
      event_category_authorization :read, EventProposal,
        model_conditions: { status: Ability::EVENT_PROPOSAL_NON_DRAFT_STATUSES },
        event_category_conditions: { can_read_pending_event_proposals: true }
      event_category_authorization(
        token_scope_action(:manage_events, :read_admin_notes, :update_admin_notes),
        EventProposal,
        event_category_conditions: { can_access_admin_notes: true }
      )
    end

    if has_scope?(:manage_events)
      event_category_authorization :update, EventProposal,
        model_conditions: { status: Ability::EVENT_PROPOSAL_NON_DRAFT_STATUSES },
        event_category_conditions: { can_update_event_proposals: true }
    end

    if has_scope?(:read_conventions)
      scope_authorization :view_event_proposals, Convention, Convention.where(
        id: StaffPosition.where(
          id: event_category_permission_scope.where(can_read_event_proposals: true).select(:staff_position_id)
        ).select(:convention_id)
      ) do |convention|
        convention.staff_positions.where(
          id: event_category_permission_scope.where(can_read_event_proposals: true).select(:staff_position_id)
        ).any?
      end

      event_category_authorization :read_admin_notes, Event,
        event_category_conditions: { can_access_admin_notes: true }

      scope_authorization token_scope_action(:manage_conventions),
        MaximumEventProvidedTicketsOverride,
        MaximumEventProvidedTicketsOverride.where(
          event_id: Event.where(
            event_category_id: event_category_permission_scope.where(
              can_override_event_tickets: true
            ).select(:event_category_id)
          ).select(:id)
        ) do |maximum_event_provided_tickets_override|
          event_category_permission_scope.where(
            event_category_id: maximum_event_provided_tickets_override.event.event_category_id,
            can_override_event_tickets: true
          ).any?
        end
    end

    if has_scope?(:manage_conventions)
      event_category_authorization :manage, Event,
        event_category_conditions: { can_update_events: true }
    end
  end

  private

  def event_category_permission_scope
    @event_category_permission_scope ||= EventCategoryPermission.for_user(user)
  end

  def event_category_authorization(action, model_class, event_category_conditions: {}, model_conditions: {})
    scope = model_class.where(
      event_category_id: event_category_permission_scope
        .where(event_category_conditions).select(:event_category_id),
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
        event_category_permission_scope.where(event_category_conditions).where(id: model.event_category_id).any?
      )
    end
  end
end
