# frozen_string_literal: true
class Orders::PurchasedNotifier < Notifier
  attr_reader :order

  dynamic_destination :order_user_con_profile do
    { order: }
  end
  dynamic_destination :triggering_user

  def initialize(order:)
    @order = order
    super(convention: order.user_con_profile.convention, event_key: "orders/purchased")
  end

  def liquid_assigns
    super.merge("order" => order)
  end

  def self.build_default_destinations(notification_template:)
    [notification_template.notification_destinations.new(dynamic_destination: :order_user_con_profile)]
  end
end
