# frozen_string_literal: true
class Types::CouponType < Types::BaseObject
  authorize_record

  field :id,
        Int,
        deprecation_reason:
          'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
        null: false
  field :transitional_id, ID, method: :id, null: false, camelize: true
  field :convention, Types::ConventionType, null: false
  field :code, String, null: false
  field :provides_product, Types::ProductType, null: true
  field :fixed_amount, Types::MoneyType, null: true
  field :percent_discount, Types::BigDecimalType, null: true
  field :usage_limit, Int, null: true
  field :expires_at, Types::DateType, null: true
end
