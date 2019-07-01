class Mutations::UpdateOrderEntry < Mutations::BaseMutation
  field :order_entry, Types::OrderEntryType, null: false

  argument :id, Integer, required: true
  argument :order_entry, Types::OrderEntryInputType, required: true, camelize: false

  load_and_authorize_model_with_id OrderEntry, :id, :update

  def resolve(**args)
    order_entry.update!(args[:order_entry].to_h)

    { order_entry: order_entry }
  end
end
