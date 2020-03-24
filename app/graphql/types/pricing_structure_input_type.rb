class Types::PricingStructureInputType < Types::BaseInputObject
  argument :pricing_strategy, Types::PricingStrategyType, required: true, camelize: false
  argument :fixed_value, Types::MoneyInputType, required: false, camelize: false
  argument :scheduled_value, Types::ScheduledMoneyValueInputType, required: false, camelize: false
end
