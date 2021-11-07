# frozen_string_literal: true
class Types::CouponType < Types::BaseObject
  authorize_record

  field :transitional_id,
        ID,
        deprecation_reason:
          "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
        null: false,
        method: :id,
        camelize: true
  field :id, ID, null: false
  field :convention, Types::ConventionType, null: false
  field :code, String, null: false
  field :provides_product, Types::ProductType, null: true
  field :fixed_amount, Types::MoneyType, null: true
  field :percent_discount, Types::BigDecimalType, null: true
  field :usage_limit, Int, null: true
  field :expires_at, Types::DateType, null: true
end
