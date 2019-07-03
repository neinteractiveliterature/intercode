class Mutations::DeleteProduct < Mutations::BaseMutation
  field :product, Types::ProductType, null: false

  argument :id, Integer, required: true

  load_and_authorize_convention_associated_model :products, :id, :destroy

  def resolve(**args)
    if product.order_entries.any?
      raise StandardError, 'This product cannot be deleted because it has been ordered.'
    end

    product.destroy!

    { product: product }
  end
end
