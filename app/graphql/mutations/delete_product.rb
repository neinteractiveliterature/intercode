# frozen_string_literal: true
class Mutations::DeleteProduct < Mutations::BaseMutation
  field :product, Types::ProductType, null: false

  argument :id, ID, required: false

  load_and_authorize_convention_associated_model :products, :id, :destroy

  def resolve(**_args)
    raise StandardError, 'This product cannot be deleted because it has been ordered.' if product.order_entries.any?

    product.destroy!

    { product: product }
  end
end
