class Types::OrderType < Types::BaseObject
  authorize_record

  field :id, Integer, null: true
  field :user_con_profile, Types::UserConProfileType, null: false
  field :status, Types::OrderStatusType, null: false
  field :total_price, Types::MoneyType, null: false
  field :payment_amount, Types::MoneyType, null: true
  field :payment_note, String, null: true
  field :charge_id, String, null: true
  field :order_entries, [Types::OrderEntryType, null: true], null: false
  field :submitted_at, Types::DateType, null: true
  field :paid_at, Types::DateType, null: true

  association_loaders Order, :user_con_profile, :order_entries
end
