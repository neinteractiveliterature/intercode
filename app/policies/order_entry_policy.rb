class OrderEntryPolicy < ApplicationPolicy
  delegate :order, to: :record
  delegate :user_con_profile, to: :order
  delegate :convention, to: :user_con_profile

  def read?
    OrderPolicy.new(authorization_info, order).read?
  end

  def manage?
    return true if oauth_scope?(:manage_profile) && order.status == 'pending' && user == user_con_profile.user
  end

  class Scope < Scope
    def resolve
      scope.where(order_id: OrderPolicy::Scope.new(authorization_info, Order.all).resolve)
    end
  end
end
