class OrderPolicy < ApplicationPolicy
  delegate :user_con_profile, to: :record
  delegate :convention, to: :user_con_profile

  def read?
    return true if oauth_scope?(:read_conventions) && has_privilege_in_convention?(convention, :con_com)
    return true if oauth_scope?(:read_profile) && user == user_con_profile.user

    super
  end

  def manage?
    return true if oauth_scope?(:manage_conventions) && staff_in_convention?(convention)

    super
  end

  def submit?
    return true if oauth_scope?(:manage_profile) && %w[pending unpaid].include?(record.status) && user == user_con_profile.user

    manage?
  end

  def cancel?
    manage?
  end

  class Scope < Scope
    def resolve
      return scope if site_admin?

      disjunctive_where do |dw|
        if oauth_scope?(:read_conventions)
          dw.add(user_con_profile_id: UserConProfile.where(convention: conventions_with_privilege(:con_com)))
        end

        if oauth_scope?(:read_profile)
          dw.add(user_con_profile_id: UserConProfile.where(user_id: user.id))
        end
      end
    end
  end
end
