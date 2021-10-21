# frozen_string_literal: true
class Mutations::DeleteOrderEntry < Mutations::BaseMutation
  field :order_entry, Types::OrderEntryType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false

  load_and_authorize_model_with_id OrderEntry, :id, :update

  def resolve(**_args)
    order_entry.destroy!
    { order_entry: order_entry }
  end
end
