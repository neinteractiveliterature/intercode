# frozen_string_literal: true
class SignupChangePolicy < ApplicationPolicy
  delegate :run, to: :record
  delegate :event, to: :run
  delegate :convention, to: :event

  def read?
    if oauth_scoped_disjunction do |d|
         d.add(:read_signups) { user && record.user_con_profile&.user_id == user.id }
         d.add(:read_conventions) { has_convention_permission?(convention, 'read_signup_details') }
         d.add(:read_events) { team_member_for_event?(event) }
       end
      return true
    end

    super
  end

  # Read-only once created
  def manage?
    false
  end

  class Scope < Scope
    def resolve
      return super if site_admin?

      disjunctive_where do |dw|
        dw.add(user_con_profile: UserConProfile.where(user_id: user.id)) if user && oauth_scope?(:read_signups)

        dw.add(run: Run.where(event: events_where_team_member)) if oauth_scope?(:read_events)

        if oauth_scope?(:read_conventions)
          dw.add(run: Run.where(event: Event.where(convention: conventions_with_permission('read_signup_details'))))
        end
      end
    end
  end
end
