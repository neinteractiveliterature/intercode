# frozen_string_literal: true
class UserActivityAlertPolicy < ApplicationPolicy
  delegate :convention, to: :record

  def read?
    if oauth_scoped_disjunction do |d|
         d.add(:read_conventions) { has_convention_permission?(convention, 'update_user_activity_alerts') }
       end
      return true
    end

    super
  end

  def manage?
    if oauth_scoped_disjunction do |d|
         d.add(:manage_conventions) { has_convention_permission?(convention, 'update_user_activity_alerts') }
       end
      return true
    end

    super
  end

  class Scope < Scope
    def resolve
      return scope.all if site_admin? && oauth_scope?(:read_conventions)

      disjunctive_where do |dw|
        if oauth_scope?(:read_conventions)
          dw.add(convention_id: conventions_with_permission('update_user_activity_alerts'))
        end
      end
    end
  end
end
