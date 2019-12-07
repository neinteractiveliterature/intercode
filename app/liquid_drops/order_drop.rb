# An order from the convention's store
class OrderDrop < Liquid::Drop
  # @api
  attr_reader :order

  # @!method id
  #   @return [Integer] The numeric database id of this order
  # @!method user_con_profile
  #   @return [UserConProfileDrop] The profile of the person who placed the order
  # @!method total_price
  #   @return [MoneyDrop] The total amount the person paid for the order
  # @!method status
  #   @return [String] The state of this order (e.g. pending, unpaid, paid, cancelled)
  delegate :id, :user_con_profile, :total_price, :status, to: :order

  # @api
  def initialize(order)
    @order = order
  end

  # @return [Array<OrderEntryDrop>] The entries in this order
  def order_entries
    order.order_entries.to_a
  end
end
