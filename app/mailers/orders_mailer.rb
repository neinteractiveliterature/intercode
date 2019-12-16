class OrdersMailer < ApplicationMailer
  def purchased(order)
    notification_mail(Orders::PurchasedNotifier.new(order: order))
  end

  def cancelled(order, refund_id = nil)
    notification_mail(Orders::CancelledNotifier.new(order: order, refund_id: refund_id))
  end
end
