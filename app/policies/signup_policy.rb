# frozen_string_literal: true
class SignupPolicy < ApplicationPolicy
  delegate :run, to: :record
  delegate :event, to: :run
  delegate :convention, to: :event

  def read?
    return false if assumed_identity_from_profile && assumed_identity_from_profile.convention != convention

    if oauth_scoped_disjunction { |d|
         d.add(:read_signups) { owned_by_user?(record.user_con_profile) }
         d.add(:read_events) { signed_up_for_run?(run) && !event.private_signup_list? }
       }
      return true
    end
    return true if read_requested_bucket_key?

    super
  end

  def read_requested_bucket_key?
    return false if assumed_identity_from_profile && assumed_identity_from_profile.convention != convention

    if oauth_scoped_disjunction { |d|
         d.add(:read_signups) { owned_by_user?(record.user_con_profile) }
         d.add(:read_conventions) { has_convention_permission?(convention, "read_signup_details") }
         d.add(:read_events) { team_member_for_event?(event) }
       }
      return true
    end

    site_admin_read?
  end

  def manage?
    if oauth_scoped_disjunction { |d|
         d.add(:manage_conventions) do
           convention.signup_mode == "moderated" && has_convention_permission?(convention, "update_signups")
         end
       }
      return true
    end

    super
  end

  # Users can sign themselves up (the signup mode check is done in EventSignupService, for better UX).  Signing
  # up somebody else is an admin action, which requires update_signups (in any signup mode) or site admin.
  def create?
    return false if assumed_identity_from_profile && assumed_identity_from_profile.convention != convention
    return true if oauth_scope?(:manage_signups) && owned_by_user?(record.user_con_profile)

    if oauth_scoped_disjunction { |d|
         d.add(:manage_conventions) { has_convention_permission?(convention, "update_signups") }
       }
      return true
    end

    site_admin_manage?
  end

  def withdraw?
    return false if assumed_identity_from_profile && assumed_identity_from_profile.convention != convention
    oauth_scope?(:manage_signups) && owned_by_user?(record.user_con_profile) ? true : manage?
  end

  %i[force_confirm? update_counted? update_bucket?].each do |team_member_action|
    define_method team_member_action do
      if oauth_scoped_disjunction { |d|
           d.add(:manage_events) { team_member_for_event?(event) }
           d.add(:manage_conventions) { has_convention_permission?(convention, "update_signups") }
         }
        return true
      end

      site_admin_manage?
    end
  end

  class Scope < Scope
    def resolve
      return super if site_admin?

      signups_scope =
        disjunctive_where do |dw|
          dw.add(user_con_profile: UserConProfile.where(user_id: user.id)) if user && oauth_scope?(:read_signups)

          if oauth_scope?(:read_events)
            dw.add(run: Run.where(event: events_where_team_member))
            dw.add(run: Run.where(id: runs_where_signed_up, event: Event.where(private_signup_list: false)))
          end

          if oauth_scope?(:read_conventions)
            dw.add(run: Run.where(event: Event.where(convention: conventions_with_permission("read_signup_details"))))
          end
        end

      if assumed_identity_from_profile
        signups_scope.where(
          run: Run.where(event: Event.where(convention_id: assumed_identity_from_profile.convention.id))
        )
      else
        signups_scope
      end
    end
  end
end
