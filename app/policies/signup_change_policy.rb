class SignupChangePolicy < ApplicationPolicy
  delegate :run, to: :record
  delegate :event, to: :run
  delegate :convention, to: :event

  def read?
    return true if oauth_scoped_disjunction do |d|
      d.add(:read_signups) { user && record.user_con_profile&.user_id == user.id }
      d.add(:read_conventions) do
        has_convention_permission?(convention, 'read_signup_details')
      end
      d.add(:read_events) do
        (signed_up_for_run?(run) && !event.private_signup_list?) || team_member_for_event?(event)
      end
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
