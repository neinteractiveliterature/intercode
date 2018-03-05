class ProductVariantDrop < Liquid::Drop
  attr_reader :product_variant
  delegate :name, :product, to: :product_variant

  def initialize(product_variant)
    @product_variant = product_variant
  end

  def description
    product.description_template&.render(self)
  end

  def image_url
    return unless product_variant.image
    product_variant.image.url
  end

  def price
    product_variant.price.format
  end
end
