# frozen_string_literal: true
class Types::PricingStructureType < Types::BaseObject
  field :price, Types::MoneyType, null: true do
    argument :time, Types::DateType, required: false
  end
  field :pricing_strategy, Types::PricingStrategyType, null: false
  field :value, Types::PricingStructureValueType, null: false

  def price(**args)
    object.price(**args)
  rescue StandardError
    nil
  end
end
