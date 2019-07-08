class TeamMemberPolicy < ApplicationPolicy
  delegate :event, :user_con_profile, to: :record
  delegate :convention, to: :event

  def read?
    return true if oauth_scoped_disjunction do |d|
      d.add(:read_events) { team_member_for_event?(event) }
      d.add(:read_conventions) { has_privilege_in_convention?(convention, :con_com, :gm_liaison) }
    end

    super
  end

  def manage?
    return true if oauth_scoped_disjunction do |d|
      d.add(:read_events) { team_member_for_event?(event) }
      d.add(:read_conventions) { has_privilege_in_convention?(convention, :gm_liaison) }
    end

    super
  end

  class Scope < Scope
    def resolve
      return scope.all if oauth_scope?(:read_conventions) && site_admin?

      disjunctive_where do |dw|
        if oauth_scope?(:read_events)
          dw.add(event_id: events_where_team_member)
        end

        if oauth_scope?(:read_conventions)
          dw.add(event_id: Event.where(
            convention_id: conventions_with_privilege(:con_com, :gm_liaison)
          ))
        end
      end
    end
  end
end
