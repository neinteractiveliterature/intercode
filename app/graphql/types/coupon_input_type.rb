# frozen_string_literal: true
class Types::CouponInputType < Types::BaseInputObject
  argument :code, String, required: false
  argument :provides_product_id,
           Int,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false,
           camelize: false
  argument :transitional_provides_product_id, ID, required: false, camelize: true
  argument :fixed_amount, Types::MoneyInputType, required: false, camelize: false
  argument :percent_discount, Types::BigDecimalType, required: false, camelize: false
  argument :usage_limit, Int, required: false, camelize: false
  argument :expires_at, Types::DateType, required: false, camelize: false
end
