# frozen_string_literal: true
class Types::PricingStructureInputType < Types::BaseInputObject
  argument :fixed_value, Types::MoneyInputType, required: false, camelize: false
  argument :pay_what_you_want_value, Types::PayWhatYouWantInputType, required: false, camelize: false
  argument :pricing_strategy, Types::PricingStrategyType, required: true, camelize: false
  argument :scheduled_value, Types::ScheduledMoneyValueInputType, required: false, camelize: false
end
