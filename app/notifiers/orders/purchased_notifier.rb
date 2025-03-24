# frozen_string_literal: true
class Orders::PurchasedNotifier < Notifier
  attr_reader :order

  def initialize(order:)
    @order = order
    super(convention: order.user_con_profile.convention, event_key: "orders/purchased")
  end

  def liquid_assigns
    super.merge("order" => order)
  end

  def destinations
    [order.user_con_profile]
  end

  def default_destinations
    [:order_user_con_profile]
  end

  def allowed_dynamic_destinations
    %i[order_user_con_profile triggering_user]
  end
end
