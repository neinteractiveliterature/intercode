class SubmitOrderService < CivilService::Service
  self.result_class = PayOrderService::Result

  validate :ensure_not_buying_duplicate_ticket
  validate :ensure_only_one_ticket
  validate :ensure_coupons_usable
  validate :ensure_free_order_is_actually_free

  attr_reader :order, :payment_mode, :stripe_token
  delegate :user_con_profile, to: :order
  delegate :convention, to: :user_con_profile

  def initialize(order, payment_mode:, stripe_token: nil)
    @order = order
    @payment_mode = payment_mode
    @stripe_token = stripe_token
  end

  private

  def inner_call
    if payment_mode == 'now'
      order.update!(submitted_at: Time.zone.now)
      PayOrderService.new(order, stripe_token).call!
    elsif payment_mode == 'free'
      order.update!(status: 'paid', submitted_at: Time.zone.now)
      success
    else
      order.update!(status: 'unpaid', submitted_at: Time.zone.now)
      success
    end
  end

  def ticket_providing_order_entries
    @ticket_providing_order_entries ||= order.order_entries.select do |entry|
      entry.product.provides_ticket_type
    end
  end

  def ensure_not_buying_duplicate_ticket
    return unless ticket_providing_order_entries.any? && user_con_profile.ticket
    errors.add :base, "You already have a #{convention.ticket_name} for #{convention.name}"
  end

  def ensure_only_one_ticket
    ticket_quantity = ticket_providing_order_entries.sum(&:quantity)
    return unless ticket_quantity > 1
    errors.add :base, "You can’t buy more than one #{convention.ticket_name}"
  end

  def ensure_coupons_usable
    order.coupons.each do |coupon|
      errors.add :base, "Coupon #{coupon.code} is expired" if coupon.expired?
      if coupon.usage_limit_reached?
        errors.add :base, "Coupon #{coupon.code} has been used up already"
      end
    end
  end

  def ensure_free_order_is_actually_free
    return unless payment_mode == 'free' && order.total_price.cents != 0
    errors.add :base, 'Cannot use free payment mode on an order that costs money'
  end
end
