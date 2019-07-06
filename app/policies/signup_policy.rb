class SignupPolicy < ApplicationPolicy
  delegate :run, to: :record
  delegate :event, to: :run
  delegate :convention, to: :event

  def read?
    return true if oauth_scoped_disjunction do |d|
      d.add(:read_signups) { user && record.user_con_profile.user_id == user.id }
      d.add(:read_events) { team_member_for_event?(event) }
      d.add(:read_conventions) { has_privilege_in_convention?(convention, :outreach, :con_com) }
    end

    super
  end

  def manage?
    return true if oauth_scoped_disjunction do |d|
      d.add(:manage_conventions) do
        convention.signup_mode == 'moderated' && staff_in_convention?(convention)
      end
    end

    super
  end

  def create?
    oauth_scope?(:manage_signups) && user
  end

  def withdraw?
    if oauth_scope?(:manage_signups) && user && record.user_con_profile.user_id == user.id
      true
    else
      manage?
    end
  end

  %i[force_confirm? update_counted? update_bucket?].each do |team_member_action|
    define_method team_member_action do
      return true if oauth_scoped_disjunction do |d|
        d.add(:manage_events) { team_member_for_event?(event) }
        d.add(:manage_conventions) { staff_in_convention?(convention) }
      end

      site_admin_manage?
    end
  end

  class Scope < Scope
    def resolve
      return super if site_admin?

      disjunctive_where do |dw|
        if user && oauth_scope?(:read_signups)
          dw.add(user_con_profile: UserConProfile.where(user_id: user.id))
        end

        dw.add(run: Run.where(event: events_where_team_member)) if oauth_scope?(:read_events)

        if oauth_scope?(:read_conventions)
          dw.add(run: runs_in_conventions_with_privilege(:outreach, :con_com))
        end
      end
    end

    private

    def runs_in_conventions_with_privilege(*privileges)
      Run.where(
        event: Event.where(
          convention: conventions_with_privilege(*privileges)
        )
      )
    end
  end
end
