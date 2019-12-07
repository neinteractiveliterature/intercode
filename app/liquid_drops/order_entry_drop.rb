# An entry in an order
class OrderEntryDrop < Liquid::Drop
  # @api
  attr_reader :order_entry

  # @!method id
  #   @return [Integer] The numeric database id of this order entry
  # @!method price
  #   @return [MoneyDrop] The total price of this entry (price_per_item * quantity)
  # @!method price_per_item
  #   @return [MoneyDrop] The price per item of this entry
  # @!method quantity
  #   @return [Integer] The quantity of the item that was ordered
  # @!method product
  #   @return [ProductDrop] The product that was ordered
  # @!method product_variant
  #   @return [ProductVariantDrop] The product variant that was ordered, if applicable
  # @!method describe_products
  #   @return [String] A text description of the product(s) ordered in this entry
  delegate :id, :price, :price_per_item, :quantity, :product, :product_variant, :describe_products,
    to: :order_entry

  # @api
  def initialize(order_entry)
    @order_entry = order_entry
  end
end
