class OrderPolicy < ApplicationPolicy
  delegate :user_con_profile, to: :record
  delegate :convention, to: :user_con_profile

  def read?
    return true if oauth_scoped_disjunction do |d|
      d.add(:read_conventions) do
        has_convention_permission?(convention, 'read_orders')
      end
      d.add(:read_profile) { user && user.id == user_con_profile.user_id }
    end

    super
  end

  def manage?
    return true if oauth_scoped_disjunction do |d|
      d.add(:manage_conventions) { has_convention_permission?(convention, 'update_orders') }
    end

    super
  end

  def manage_coupons?
    manage? || submit?
  end

  def submit?
    return true if oauth_scoped_disjunction do |d|
      d.add(:manage_profile) do
        %w[pending unpaid].include?(record.status) && user && user.id == user_con_profile.user_id
      end
    end

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
          dw.add(
            user_con_profile_id: UserConProfile.where(
              convention: conventions_with_permission('read_orders', 'update_orders')
            )
          )
        end

        if user && oauth_scope?(:read_profile)
          dw.add(user_con_profile_id: UserConProfile.where(user_id: user.id))
        end
      end
    end
  end
end
