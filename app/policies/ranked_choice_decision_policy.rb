# frozen_string_literal: true
class RankedChoiceDecisionPolicy < ApplicationPolicy
  delegate :signup_round, to: :record
  delegate :convention, to: :signup_round

  def read?
    return false if assumed_identity_from_profile && assumed_identity_from_profile.convention != convention

    if oauth_scoped_disjunction { |d|
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
    # RankedChoiceDecisions are read only
    false
  end

  class Scope < Scope
    def resolve
      return scope.all if site_admin?

      decision_scope =
        disjunctive_where do |dw|
          if oauth_scope?(:read_conventions)
            dw.add(
              user_con_profile:
                UserConProfile.where(
                  convention:
                    conventions_with_permission("update_signups").where(signup_automation_mode: "ranked_choice")
                )
            )
          end
        end

      if assumed_identity_from_profile
        decision_scope.where(
          target_run: Run.where(event: Event.where(convention_id: assumed_identity_from_profile.convention_id))
        )
      else
        decision_scope
      end
    end
  end
end
