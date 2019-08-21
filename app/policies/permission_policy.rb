class PermissionPolicy < ApplicationPolicy
  delegate :staff_position, to: :record
  delegate :convention, to: :staff_position, allow_nil: true

  def read?
    return true if oauth_scoped_disjunction do |d|
      d.add(:read_conventions) do
        convention && has_convention_permission?(convention, 'update_permissions')
      end
    end

    super
  end

  def manage?
    return true if oauth_scoped_disjunction do |d|
      d.add(:manage_conventions) do
        convention && has_convention_permission?(convention, 'update_permissions')
      end
    end

    super
  end

  class Scope < Scope
    def resolve
      return scope.all if site_admin?

      if oauth_scope?(:read_conventions)
        scope.where(
          staff_position: StaffPosition.where(
            convention: conventions_with_permission('update_permissions')
          )
        )
      else
        scope.none
      end
    end
  end
end
