# frozen_string_literal: true
class OrganizationPolicy < ApplicationPolicy
  def read?
    oauth_scoped_disjunction do |d|
      d.add(:read_organizations) { site_admin? || organizations_with_permission('manage_organization_access').any? }
    end
  end

  def manage?
    oauth_scoped_disjunction { |d| d.add(:manage_organizations) { site_admin? } }
  end

  class Scope < Scope
    def resolve
      return scope.none unless oauth_scope?(:read_organizations)

      site_admin? || organizations_with_permission('manage_organization_access').any? ? scope.all : scope.none
    end
  end
end
