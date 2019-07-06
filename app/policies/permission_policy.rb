class PermissionPolicy < ApplicationPolicy
  def read?
    return true if oauth_scoped_disjunction do |d|
      d.add(:read_conventions) do
        record.staff_position && staff_in_convention?(record.staff_position.convention)
      end
    end

    super
  end

  def manage?
    return true if oauth_scoped_disjunction do |d|
      d.add(:manage_conventions) do
        record.staff_position && staff_in_convention?(record.staff_position.convention)
      end
    end

    super
  end

  class Scope < Scope
    def resolve
      return scope.all if site_admin?

      if oauth_scope?(:read_conventions)
        scope.where(
          staff_position: StaffPosition.where(convention: conventions_with_privilege(:staff))
        )
      else
        scope.none
      end
    end
  end
end
