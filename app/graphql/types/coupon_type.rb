# frozen_string_literal: true
class Types::CouponType < Types::BaseObject
  authorize_record

  field :code, String, null: false
  field :convention, Types::ConventionType, null: false
  field :expires_at, Types::DateType, null: true
  field :fixed_amount, Types::MoneyType, null: true
  field :id, ID, null: false
  field :percent_discount, Types::BigDecimalType, null: true
  field :provides_product, Types::ProductType, null: true
  field :usage_limit, Int, null: true
end
