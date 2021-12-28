# frozen_string_literal: true
class OrderEntryPolicy < ApplicationPolicy
  delegate :order, to: :record
  delegate :user_con_profile, to: :order
  delegate :convention, to: :user_con_profile

  def read?
    OrderPolicy.new(authorization_info, order).read?
  end

  def manage?
    return false if assumed_identity_from_profile && assumed_identity_from_profile.convention != convention

    if oauth_scoped_disjunction do |d|
         d.add(:manage_profile) { order.status == 'pending' && user && user.id == user_con_profile.user.id }
       end
      return true
    end

    super
  end

  def change_price?
    if oauth_scoped_disjunction do |d|
         d.add(:manage_conventions) { has_convention_permission?(convention, 'update_orders') }
       end
      return true
    end

    site_admin_manage?
  end

  class Scope < Scope
    def resolve
      scope.where(order_id: OrderPolicy::Scope.new(authorization_info, Order.all).resolve)
    end
  end
end
