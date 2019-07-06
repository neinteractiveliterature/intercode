class OrganizationRolePolicy < ApplicationPolicy
  def read?
    oauth_scoped_disjunction do |d|
      d.add(:read_organizations) do
        site_admin? ||
          has_organization_permission?(record.organization_id, 'manage_organization_access')
      end
    end
  end

  def manage?
    oauth_scoped_disjunction do |d|
      d.add(:manage_organizations) do
        site_admin? ||
          has_organization_permission?(record.organization_id, 'manage_organization_access')
      end
    end
  end

  class Scope < Scope
    def resolve
      return scope.all if site_admin?

      scope.where(organization_id: organizations_with_permission('manage_organization_access'))
    end
  end
end
