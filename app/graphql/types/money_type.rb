# frozen_string_literal: true
class Types::MoneyType < Types::BaseObject
  field :currency_code, String, null: false
  field :fractional, Integer, null: false

  def currency_code
    object.currency.iso_code
  end
end
