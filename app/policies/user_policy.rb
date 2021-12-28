# frozen_string_literal: true
class UserPolicy < ApplicationPolicy
  def read?
    return true if user && user == record
    if assumed_identity_from_profile &&
         record.user_con_profiles.where(convention_id: assumed_identity_from_profile.convention_id).none?
      return false
    end

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
    oauth_scope?(:manage_organizations) && actual_user.site_admin?
  end

  def update?
    return false if assumed_identity_from_profile && !actual_user.site_admin?
    return true if oauth_scoped_disjunction { |d| d.add(:manage_profile) { user && user == record } }

    manage?
  end

  def merge?
    manage?
  end

  class Scope < Scope
    def resolve
      return scope.all if site_admin? && oauth_scope?(:read_organizations)

      user_scope =
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

      if assumed_identity_from_profile
        user_scope.where(
          id: UserConProfile.where(convention_id: assumed_identity_from_profile.convention_id).select(:user_id)
        )
      else
        user_scope
      end
    end
  end
end
