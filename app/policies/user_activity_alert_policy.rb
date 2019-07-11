class UserActivityAlertPolicy < ApplicationPolicy
  delegate :convention, to: :record

  def read?
    return true if oauth_scoped_disjunction do |d|
      d.add(:read_conventions) { staff_in_convention?(convention) }
    end

    super
  end

  def manage?
    return true if oauth_scoped_disjunction do |d|
      d.add(:manage_conventions) { staff_in_convention?(convention) }
    end

    super
  end

  class Scope < Scope
    def resolve
      return scope.all if site_admin? && oauth_scope?(:read_conventions)

      disjunctive_where do |dw|
        dw.add(convention_id: conventions_where_staff) if oauth_scope?(:read_conventions)
      end
    end
  end
end
