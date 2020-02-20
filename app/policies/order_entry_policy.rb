class OrderEntryPolicy < ApplicationPolicy
  delegate :order, to: :record
  delegate :user_con_profile, to: :order
  delegate :convention, to: :user_con_profile

  def read?
    OrderPolicy.new(authorization_info, order).read?
  end

  def manage?
    return true if oauth_scoped_disjunction do |d|
      d.add(:manage_profile) do
        order.status == 'pending' && user && user.id == user_con_profile.user.id
      end
    end

    super
  end

  class Scope < Scope
    def resolve
      scope.where(order_id: OrderPolicy::Scope.new(authorization_info, Order.all).resolve)
    end
  end
end
