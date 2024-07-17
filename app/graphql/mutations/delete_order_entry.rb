# frozen_string_literal: true
class Mutations::DeleteOrderEntry < Mutations::BaseMutation
  field :order_entry, Types::OrderEntryType, null: false

  argument :id, ID, required: false

  load_and_authorize_model_with_id OrderEntry, :id, :update

  def resolve(**_args)
    order_entry.destroy!
    { order_entry: order_entry }
  end
end
