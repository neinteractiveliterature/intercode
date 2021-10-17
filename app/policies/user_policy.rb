# frozen_string_literal: true
class UserPolicy < ApplicationPolicy
  def read?
    return true if user && user == record

    oauth_scoped_disjunction do |d|
      d.add(:read_organizations) do
        site_admin? ||
          record
            .user_con_profiles
            .where(convention: conventions_with_organization_permission('read_convention_users'))
            .any?
      end
    end
  end

  def manage?
    oauth_scope?(:manage_organizations) && site_admin?
  end

  def update?
    return true if oauth_scoped_disjunction { |d| d.add(:manage_profile) { user && user == record } }

    manage?
  end

  def merge?
    manage?
  end

  class Scope < Scope
    def resolve
      return scope.all if site_admin? && oauth_scope?(:read_organizations)

      disjunctive_where do |dw|
        dw.add(id: user.id) if user

        if oauth_scope?(:read_organizations)
          dw.add(
            id:
              UserConProfile
                .where(convention: conventions_with_organization_permission('read_convention_users'))
                .select(:user_id)
          )
        end
      end
    end
  end
end
