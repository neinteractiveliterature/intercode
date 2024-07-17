# frozen_string_literal: true
class Types::PricingStructureType < Types::BaseObject
  field :pricing_strategy, Types::PricingStrategyType, null: false
  field :value, Types::PricingStructureValueType, null: false
  field :price, Types::MoneyType, null: true do
    argument :time, Types::DateType, required: false
  end

  def price(**args)
    object.price(**args)
  rescue StandardError
    nil
  end
end
