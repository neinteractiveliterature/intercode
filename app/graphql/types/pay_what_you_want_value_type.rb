# frozen_string_literal: true
class Types::PayWhatYouWantValueType < Types::BaseObject
  field :allowed_currency_codes, [String], null: true
  field :maximum_amount, Types::MoneyType, null: true
  field :minimum_amount, Types::MoneyType, null: true
  field :suggested_amount, Types::MoneyType, null: true
end
