class Types::PricingStructureType < Types::BaseObject
  field :pricing_strategy, Types::PricingStrategyType, null: false
  field :value, Types::PricingStructureValueType, null: false
end
