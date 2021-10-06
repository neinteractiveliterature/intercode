# frozen_string_literal: true
class Mutations::DeleteProduct < Mutations::BaseMutation
  field :product, Types::ProductType, null: false

  argument :id,
           Integer,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false
  argument :transitional_id, ID, required: false, camelize: true

  load_and_authorize_convention_associated_model :products, :id, :destroy

  def resolve(**_args)
    raise StandardError, 'This product cannot be deleted because it has been ordered.' if product.order_entries.any?

    product.destroy!

    { product: product }
  end
end
