# frozen_string_literal: true
class Mutations::DeleteOrderEntry < Mutations::BaseMutation
  field :order_entry, Types::OrderEntryType, null: false

  argument :id,
           Integer,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false
  argument :transitional_id, ID, required: false, camelize: true

  load_and_authorize_model_with_id OrderEntry, :id, :update

  def resolve(**_args)
    order_entry.destroy!
    { order_entry: order_entry }
  end
end
