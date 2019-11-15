class TeamMemberPolicy < ApplicationPolicy
  delegate :event, :user_con_profile, to: :record
  delegate :convention, to: :event

  def read?
    return true if oauth_scoped_disjunction do |d|
      d.add(:read_events) do
        EventPolicy.new(authorization_info, event).read?
      end
      d.add(:read_conventions) do
        has_convention_permission?(convention, 'update_event_team_members')
      end
    end

    super
  end

  def manage?
    return true if oauth_scoped_disjunction do |d|
      d.add(:read_events) { team_member_for_event?(event) }
      d.add(:read_conventions) do
        has_convention_permission?(convention, 'update_event_team_members')
      end
    end

    super
  end

  class Scope < Scope
    def resolve
      return scope.all if oauth_scope?(:read_conventions) && site_admin?
      return scope.none unless oauth_scope?(:read_events)

      disjunctive_where do |dw|
        dw.add(event: events_where_team_member)
        dw.add(event: EventPolicy::Scope.new(user, Event.all).resolve)
        dw.add(event: Event.where(
          convention: conventions_with_permission('update_event_team_members')
        ))
      end
    end
  end
end
