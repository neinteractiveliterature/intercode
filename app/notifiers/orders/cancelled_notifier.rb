# frozen_string_literal: true
class Orders::CancelledNotifier < Notifier
  attr_reader :order, :refund_id

  def initialize(order:, refund_id:)
    @order = order
    @refund_id = refund_id
    super(convention: order.user_con_profile.convention, event_key: "orders/cancelled")
  end

  def liquid_assigns
    super.merge("order" => order, "refund_id" => refund_id)
  end

  def destinations
    [order.user_con_profile]
  end

  def self.build_default_destinations(notification_template:)
    [notification_template.notification_destinations.new(dynamic_destination: :order_user_con_profile)]
  end

  def self.allowed_dynamic_destinations
    %i[order_user_con_profile triggering_user]
  end
end
