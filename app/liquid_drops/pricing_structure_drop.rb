# frozen_string_literal: true
# A pricing structure for a product, which can follow one of a variety of pricing strategies
# (e.g. fixed price, scheduled price changes, etc.)
class PricingStructureDrop < Liquid::Drop
  # @api
  attr_reader :pricing_structure, :timezone

  # @!method pricing_strategy
  #   @return [String] The strategy used by this pricing structure
  # @!method price
  #   @return [MoneyDrop] The current default price of this pricing structure
  delegate :pricing_strategy, :price, to: :pricing_structure

  # @api
  def initialize(pricing_structure, timezone)
    @pricing_structure = pricing_structure
    @timezone = timezone
  end

  # @return [MoneyDrop] The scheduled value associated with this pricing structure, if any
  def fixed_value
    return unless pricing_strategy == 'fixed'
    pricing_structure.value
  end

  # @return [ScheduledValueDrop] The scheduled value associated with this pricing structure, if any
  def scheduled_value
    return unless pricing_strategy == 'scheduled_value'
    ScheduledValueDrop.new(pricing_structure.value, timezone)
  end

  # @return [PayWhatYouWantValueDrop] The pay-what-you-want value associated with this pricing structure, if any
  def pay_what_you_want_value
    return unless pricing_strategy == 'pay_what_you_want'
    PayWhatYouWantValueDrop.new(pricing_structure.value)
  end
end
