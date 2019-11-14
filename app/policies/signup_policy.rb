class SignupPolicy < ApplicationPolicy
  delegate :run, to: :record
  delegate :event, to: :run
  delegate :convention, to: :event

  def read?
    return true if oauth_scoped_disjunction do |d|
      d.add(:read_signups) { user && record.user_con_profile&.user_id == user.id }
      d.add(:read_events) { signed_up_for_run?(run) && !event.private_signup_list? }
    end
    return true if read_requested_bucket_key?

    super
  end

  def read_requested_bucket_key?
    return true if oauth_scoped_disjunction do |d|
      d.add(:read_signups) { user && record.user_con_profile&.user_id == user.id }
      d.add(:read_events) { team_member_for_event?(event) }
      d.add(:read_conventions) do
        has_convention_permission?(convention, 'read_signup_details')
      end
    end

    site_admin_read?
  end

  def manage?
    return true if oauth_scoped_disjunction do |d|
      d.add(:manage_conventions) do
        convention.signup_mode == 'moderated' &&
        has_convention_permission?(convention, 'update_signups')
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
        d.add(:manage_conventions) { has_convention_permission?(convention, 'update_signups') }
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

        if oauth_scope?(:read_events)
          dw.add(run: Run.where(event: events_where_team_member))
          dw.add(run: Run.where(
            id: runs_where_signed_up,
            event: Event.where(private_signup_list: false)
          ))
        end

        if oauth_scope?(:read_conventions)
          dw.add(
            run: Run.where(
              event: Event.where(
                convention: conventions_with_permission('read_signup_details')
              )
            )
          )
        end
      end
    end
  end
end
