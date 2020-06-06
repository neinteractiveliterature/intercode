class CouponPolicy < ApplicationPolicy
  delegate :convention, to: :record

  # Coupons are special; they are by definition semi-secret.  So we use the "update_products"
  # permission as a proxy for "can see the existence of coupons".

  def read?
    return true if oauth_scoped_disjunction do |d|
      d.add(:read_conventions) { has_convention_permission?(convention, 'update_products') }
      d.add(:read_profile) do
        user && CouponApplication.joins(order: :user_con_profile).where(
          user_con_profiles: { user_id: user.id }
        ).any?
      end
    end

    super
  end

  def manage?
    return true if oauth_scoped_disjunction do |d|
      d.add(:manage_conventions) { has_convention_permission?(convention, 'update_products') }
    end

    super
  end

  class Scope < Scope
    def resolve
      return scope if site_admin?

      disjunctive_where do |dw|
        if oauth_scope?(:read_conventions)
          dw.add(
            convention_id: conventions_with_permission('update_products').select(:id)
          )
        end
      end
    end
  end
end
