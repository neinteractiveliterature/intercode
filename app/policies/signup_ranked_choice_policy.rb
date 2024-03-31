# frozen_string_literal: true
class SignupRankedChoicePolicy < ApplicationPolicy
  delegate :target_run, to: :record
  delegate :event, to: :target_run
  delegate :convention, to: :event

  def read?
    return false if assumed_identity_from_profile && assumed_identity_from_profile.convention != convention

    if oauth_scoped_disjunction { |d|
         d.add(:read_signups) { record.user_con_profile.user_id == user&.id }

         d.add(:read_conventions) do
           convention.signup_automation_mode == "ranked_choice" &&
             has_convention_permission?(convention, "update_signups")
         end
       }
      return true
    end

    super
  end

  def manage?
    if oauth_scoped_disjunction { |d|
         d.add(:manage_conventions) do
           convention.signup_automation_mode == "ranked_choice" &&
             has_convention_permission?(convention, "update_signups")
         end
       }
      return true
    end

    super
  end

  def accept?
    manage?
  end

  def reject?
    manage?
  end

  def create?
    return false unless oauth_scope?(:manage_signups)
    return false if assumed_identity_from_profile && assumed_identity_from_profile.convention != convention
    user && user.id == record.user_con_profile.user_id && (convention.signup_automation_mode == "ranked_choice")
  end

  def withdraw?
    return false unless oauth_scope?(:manage_signups)
    return false if assumed_identity_from_profile && assumed_identity_from_profile.convention != convention
    user && record.state == "pending" && user.id == record.user_con_profile.user_id
  end

  class Scope < Scope
    # rubocop:disable Metrics/MethodLength
    def resolve
      return scope.all if site_admin?

      signup_request_scope =
        disjunctive_where do |dw|
          dw.add(user_con_profile_id: UserConProfile.where(user_id: user.id)) if user && oauth_scope?(:read_signups)

          if oauth_scope?(:read_conventions)
            dw.add(
              target_run:
                Run.where(
                  event:
                    Event.where(
                      convention:
                        conventions_with_permission("update_signups").where(signup_automation_mode: "ranked_choice")
                    )
                )
            )
          end
        end

      if assumed_identity_from_profile
        signup_request_scope.where(
          target_run: Run.where(event: Event.where(convention_id: assumed_identity_from_profile.convention_id))
        )
      else
        signup_request_scope
      end
    end
    # rubocop:enable Metrics/MethodLength
  end
end
