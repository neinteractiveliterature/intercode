# frozen_string_literal: true
class Types::MoneyInputType < Types::BaseInputObject
  argument :currency_code, String, required: true, camelize: false
  argument :fractional, Integer, required: true
end
