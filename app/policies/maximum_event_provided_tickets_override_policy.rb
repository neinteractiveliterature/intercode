class MaximumEventProvidedTicketsOverridePolicy < ApplicationPolicy
  delegate :event, to: :record
  delegate :convention, to: :event

  def read?
    return true if oauth_scoped_disjunction do |d|
      d.add(:read_events) do
        has_convention_permission?(convention, 'override_event_tickets') ||
        has_event_category_permission?(event.event_category, 'override_event_tickets') ||
        team_member_for_event?(event)
      end
    end

    super
  end

  def manage?
    return true if oauth_scoped_disjunction do |d|
      d.add(:manage_events) do
        has_convention_permission?(convention, 'override_event_tickets') ||
        has_event_category_permission?(event.event_category, 'override_event_tickets')
      end
    end

    super
  end

  class Scope < Scope
    def resolve
      return scope if site_admin?

      disjunctive_where do |dw|
        if oauth_scope?(:read_events)
          dw.add(event_id: Event.where(
            convention_id: conventions_with_permission('override_event_tickets')
          ))
          dw.add(event_id: events_where_has_event_category_permission('override_event_tickets'))
          dw.add(event_id: events_where_team_member)
        end
      end
    end
  end
end
