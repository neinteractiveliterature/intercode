class Orders::CancelledNotifier < Notifier
  attr_reader :order, :refund_id

  def initialize(order:, refund_id:)
    @order = order
    @refund_id = refund_id
    super(convention: order.user_con_profile.convention, event_key: 'orders/purchased')
  end

  def liquid_assigns
    super.merge('order' => order, 'refund_id' => refund_id)
  end

  def destinations
    [order.user_con_profile]
  end
end
