class OrdersMailer < ApplicationMailer
  def purchased(order)
    @order = order

    mail(
      from: from_address_for_convention(order.user_con_profile.convention),
      to: order.user_con_profile.email,
      subject: "#{subject_prefix(order)} Order Receipt"
    )
  end

  def cancelled(order, refund_id = nil)
    @order = order
    @refund_id = refund_id

    mail(
      from: from_address_for_convention(order.user_con_profile.convention),
      to: order.user_con_profile.email,
      subject: "#{subject_prefix(order)} Order Cancellation"
    )
  end

  private

  def subject_prefix(order)
    "[#{order.user_con_profile.convention.name}]"
  end
end
