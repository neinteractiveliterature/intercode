# frozen_string_literal: true
class Mutations::UpdateOrderEntry < Mutations::BaseMutation
  include OrderEntryInputs

  field :order_entry, Types::OrderEntryType, null: false

  argument :id, ID, required: false
  argument :order_entry, Types::OrderEntryInputType, required: true, camelize: false

  load_and_authorize_model_with_id OrderEntry, :id, :update

  def resolve(**args)
    order_entry.update!(process_order_entry_input(args[:order_entry], order_entry))

    { order_entry: order_entry }
  end
end
