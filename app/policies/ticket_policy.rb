# frozen_string_literal: true
class TicketPolicy < ApplicationPolicy
  delegate :user_con_profile, to: :record
  delegate :convention, to: :user_con_profile, allow_nil: true

  def read?
    return false if assumed_identity_from_profile && assumed_identity_from_profile.convention != convention

    if oauth_scoped_disjunction do |d|
         d.add(:read_conventions) { has_convention_permission?(convention, 'read_tickets') }
         d.add(:read_events) { team_member_in_convention?(convention) }
         d.add(:read_profile) { user && user.id == user_con_profile.user_id }
       end
      return true
    end

    super
  end

  def provide?
    if oauth_scoped_disjunction do |d|
         d.add(:manage_events) { record.provided_by_event && team_member_for_event?(record.provided_by_event) }
       end
      return true
    end

    manage?
  end

  def manage?
    return true if oauth_scope?(:manage_conventions) && has_convention_permission?(convention, 'update_tickets')

    super
  end

  class Scope < Scope
    def resolve
      return scope if site_admin?

      ticket_scope =
        disjunctive_where do |dw|
          if oauth_scope?(:read_conventions)
            dw.add(user_con_profile_id: UserConProfile.where(convention: conventions_with_permission('read_tickets')))
          end

          if oauth_scope?(:read_events)
            dw.add(user_con_profile_id: UserConProfile.where(convention: conventions_where_team_member))
          end

          dw.add(user_con_profile_id: UserConProfile.where(user_id: user.id)) if oauth_scope?(:read_profile)
        end

      if assumed_identity_from_profile
        ticket_scope.where(
          user_con_profile_id: UserConProfile.where(convention_id: assumed_identity_from_profile.convention)
        )
      else
        ticket_scope
      end
    end
  end
end
