class Mutations::DeleteProduct < Mutations::BaseMutation
  field :product, Types::ProductType, null: false

  argument :id, Integer, required: true

  def resolve(**args)
    product = convention.products.find(args[:id])
    if product.order_entries.any?
      raise StandardError, 'This product cannot be deleted because it has been ordered.'
    end

    product.destroy!

    { product: product }
  end
end
