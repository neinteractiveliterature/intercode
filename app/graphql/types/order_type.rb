Types::OrderType = GraphQL::ObjectType.define do
  name 'Order'
  field :id, types.Int
  field :user_con_profile, !Types::UserConProfileType do
    resolve ->(obj, _args, _ctx) {
      AssociationLoader.for(Order, :user_con_profile).load(obj)
    }
  end
  field :status, !types.String
  field :payment_amount, Types::MoneyType
  field :charge_id, types.String
  field :order_entries, !types[Types::OrderEntryType] do
    resolve ->(obj, _args, _ctx) {
      AssociationLoader.for(Order, :order_entries).load(obj)
    }
  end
end
