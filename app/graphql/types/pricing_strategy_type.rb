class Types::PricingStrategyType < Types::BaseEnum
  value('fixed', 'Fixed price')
  value('scheduled_value', 'Price that changes over time')
end
