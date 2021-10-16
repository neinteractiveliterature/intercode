# frozen_string_literal: true
class SignupRequestPolicy < ApplicationPolicy
  delegate :target_run, to: :record
  delegate :event, to: :target_run
  delegate :convention, to: :event

  def read?
    if oauth_scoped_disjunction do |d|
         d.add(:read_signups) { record.user_con_profile.user_id == user&.id }

         d.add(:read_conventions) do
           convention.signup_mode == 'moderated' && has_convention_permission?(convention, 'update_signups')
         end
       end
      return true
    end

    super
  end

  def manage?
    if oauth_scoped_disjunction do |d|
         d.add(:manage_conventions) do
           convention.signup_mode == 'moderated' && has_convention_permission?(convention, 'update_signups')
         end
       end
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
    user && user.id == record.user_con_profile.user_id && convention.signup_mode == 'moderated'
  end

  def withdraw?
    return false unless oauth_scope?(:manage_signups)
    user && record.state == 'pending' && user.id == record.user_con_profile.user_id
  end

  class Scope < Scope
    def resolve
      return scope.all if site_admin?

      disjunctive_where do |dw|
        dw.add(user_con_profile_id: UserConProfile.where(user_id: user.id)) if user && oauth_scope?(:read_signups)

        if oauth_scope?(:read_conventions)
          dw.add(
            target_run:
              Run.where(
                event:
                  Event.where(convention: conventions_with_permission('update_signups').where(signup_mode: 'moderated'))
              )
          )
        end
      end
    end
  end
end
