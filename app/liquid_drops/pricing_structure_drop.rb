# A pricing structure for a product, which can follow one of a variety of pricing strategies
# (e.g. fixed price, scheduled price changes, etc.)
class PricingStructureDrop < Liquid::Drop
  # @api
  attr_reader :pricing_structure

  # @!method pricing_strategy
  #   @return [String] The strategy used by this pricing structure
  delegate :name, :product, to: :pricing_structure

  # @api
  def initialize(pricing_structure)
    @pricing_structure = pricing_structure
  end

  # @return [String] The current default price of this pricing structure
  def price
    pricing_structure.price.format
  end
end
