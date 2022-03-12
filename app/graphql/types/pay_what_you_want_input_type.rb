# frozen_string_literal: true
class Types::PayWhatYouWantInputType < Types::BaseInputObject
  argument :minimum_amount, Types::MoneyInputType, required: false
  argument :maximum_amount, Types::MoneyInputType, required: false
  argument :suggested_amount, Types::MoneyInputType, required: false
end
