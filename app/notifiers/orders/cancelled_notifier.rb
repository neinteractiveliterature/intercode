# frozen_string_literal: true
class Orders::CancelledNotifier < Notifier
  attr_reader :order, :refund_id

  dynamic_destination :order_user_con_profile do
    { order: }
  end
  dynamic_destination :triggering_user

  def initialize(order:, refund_id:, triggering_user: nil)
    @order = order
    @refund_id = refund_id
    super(convention: order.user_con_profile.convention, event_key: "orders/cancelled", triggering_user:)
  end

  def liquid_assigns
    super.merge("order" => order, "refund_id" => refund_id)
  end

  def self.build_default_destinations(notification_template:)
    [notification_template.notification_destinations.new(dynamic_destination: :order_user_con_profile)]
  end
end
