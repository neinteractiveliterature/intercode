class OrdersMailer < ApplicationMailer
  def purchased(order)
    notification_template_mail(
      order.user_con_profile.convention,
      'orders/purchased',
      { 'order' => order },
      from: from_address_for_convention(order.user_con_profile.convention),
      to: order.user_con_profile.email,
    )
  end

  def cancelled(order, refund_id = nil)
    notification_template_mail(
      order.user_con_profile.convention,
      'orders/cancelled',
      { 'order' => order, 'refund_id' => refund_id },
      from: from_address_for_convention(order.user_con_profile.convention),
      to: order.user_con_profile.email,
    )
  end
end
