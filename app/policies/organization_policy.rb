class OrganizationPolicy < ApplicationPolicy
  def read?
    oauth_scoped_disjunction do |d|
      d.add(:read_organizations) do
        site_admin? || organizations_with_permission('manage_organization_access').any?
      end
    end
  end

  def manage?
    oauth_scoped_disjunction do |d|
      d.add(:manage_organizations) do
        site_admin?
      end
    end
  end

  class Scope < Scope
    def resolve
      return scope.none unless oauth_scope?(:read_organization_access)

      if site_admin? || organizations_with_permission('manage_organization_access').any?
        scope.all
      else
        scope.none
      end
    end
  end
end
