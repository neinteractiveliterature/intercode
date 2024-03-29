# frozen_string_literal: true
class TeamMemberPolicy < ApplicationPolicy
  delegate :event, :user_con_profile, to: :record
  delegate :convention, to: :event

  def read?
    return false if assumed_identity_from_profile && assumed_identity_from_profile.convention != convention

    if oauth_scoped_disjunction do |d|
         d.add(:read_events) { EventPolicy.new(authorization_info, event).read? }
         d.add(:read_conventions) do
           EventPolicy.new(authorization_info, event).read? &&
             has_convention_permission?(convention, 'update_event_team_members')
         end
       end
      return true
    end

    super
  end

  def manage?
    if oauth_scoped_disjunction do |d|
         d.add(:read_events) { team_member_for_event?(event) }
         d.add(:read_conventions) { has_convention_permission?(convention, 'update_event_team_members') }
       end
      return true
    end

    super
  end

  class Scope < Scope
    def resolve
      return scope.all if oauth_scope?(:read_conventions) && site_admin?
      return scope.none unless oauth_scope?(:read_events)

      team_member_scope =
        disjunctive_where do |dw|
          dw.add(event: events_where_team_member)
          dw.add(event: EventPolicy::Scope.new(authorization_info, Event.all).resolve)
          dw.add(event: Event.where(convention: conventions_with_permission('update_event_team_members')))
        end

      if assumed_identity_from_profile
        team_member_scope.where(event: Event.where(convention_id: assumed_identity_from_profile.convention_id))
      else
        team_member_scope
      end
    end
  end
end
