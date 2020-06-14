class Types::CouponType < Types::BaseObject
  authorize_record

  field :id, Int, null: false
  field :convention, Types::ConventionType, null: false
  field :code, String, null: false
  field :provides_product, Types::ProductType, null: true
  field :fixed_amount, Types::MoneyType, null: true
  field :percent_discount, Types::BigDecimalType, null: true
  field :usage_limit, Int, null: true
  field :expires_at, Types::DateType, null: true
end
