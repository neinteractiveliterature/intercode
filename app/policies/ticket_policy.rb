class TicketPolicy < ApplicationPolicy
  delegate :user_con_profile, to: :record
  delegate :convention, to: :user_con_profile, allow_nil: true

  def read?
    return true if oauth_scoped_disjunction do |d|
      d.add(:read_conventions) do
        staff_in_convention?(convention) ||
          has_convention_permission?(convention, 'read_tickets')
      end
      d.add(:read_events) { team_member_in_convention?(convention) }
      d.add(:read_profile) { user && user.id == user_con_profile.user_id }
    end

    super
  end

  def provide?
    return true if oauth_scoped_disjunction do |d|
      d.add(:manage_events) { record.provided_by_event && team_member_for_event?(record.provided_by_event) }
    end

    manage?
  end

  def manage?
    return true if oauth_scope?(:manage_conventions) && staff_in_convention?(convention)

    super
  end

  class Scope < Scope
    def resolve
      return scope if site_admin?

      disjunctive_where do |dw|
        if oauth_scope?(:read_conventions)
          dw.add(user_con_profile: UserConProfile.where(convention: conventions_where_staff))
          dw.add(user_con_profile_id: UserConProfile.where(
            convention: conventions_with_permission('read_tickets')
          ))
        end

        if oauth_scope?(:read_events)
          dw.add(user_con_profile_id: UserConProfile.where(
            convention: conventions_where_team_member
          ))
        end

        if oauth_scope?(:read_profile)
          dw.add(user_con_profile_id: UserConProfile.where(user_id: user.id))
        end
      end
    end
  end
end
