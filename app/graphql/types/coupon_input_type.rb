# frozen_string_literal: true
class Types::CouponInputType < Types::BaseInputObject
  argument :code, String, required: false
  argument :provides_product_id, ID, required: false, camelize: true
  argument :fixed_amount, Types::MoneyInputType, required: false, camelize: false
  argument :percent_discount, Types::BigDecimalType, required: false, camelize: false
  argument :usage_limit, Int, required: false, camelize: false
  argument :expires_at, Types::DateType, required: false, camelize: false
end
