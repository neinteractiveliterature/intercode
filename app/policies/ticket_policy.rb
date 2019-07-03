class TicketPolicy < ApplicationPolicy
  delegate :user_con_profile, to: :record
  delegate :convention, to: :user_con_profile

  def read?
    return true if oauth_scoped_disjunction do |d|
      d.add(:read_conventions) { has_privilege_in_convention?(convention, :con_com) }
      d.add(:read_events) { has_privilege_in_convention?(convention) }
      d.add(:read_profile) { user.id == user_con_profile.user_id }
    end

    super
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
          dw.add(user_con_profile_id: UserConProfile.where(convention: conventions_with_privilege(:con_com)))
        end

        if oauth_scope?(:read_events)
          dw.add(user_con_profile_id: UserConProfile.where(convention: conventions_where_team_member))
        end

        if oauth_scope?(:read_profile)
          dw.add(user_con_profile_id: UserConProfile.where(user_id: user.id))
        end
      end
    end
  end
end
