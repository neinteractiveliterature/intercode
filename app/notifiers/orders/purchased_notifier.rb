class Orders::PurchasedNotifier < Notifier
  attr_reader :order

  def initialize(order:)
    @order = order
    super(convention: order.user_con_profile.convention, event_key: 'orders/purchased')
  end

  def liquid_assigns
    super.merge('order' => order)
  end

  def destinations
    [order.user_con_profile]
  end
end
