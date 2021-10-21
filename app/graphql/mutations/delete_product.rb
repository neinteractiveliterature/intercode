# frozen_string_literal: true
class Mutations::DeleteProduct < Mutations::BaseMutation
  field :product, Types::ProductType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false

  load_and_authorize_convention_associated_model :products, :id, :destroy

  def resolve(**_args)
    raise StandardError, 'This product cannot be deleted because it has been ordered.' if product.order_entries.any?

    product.destroy!

    { product: product }
  end
end
