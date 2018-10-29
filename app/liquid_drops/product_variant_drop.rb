# A variant of a product that can be sold at this convention
class ProductVariantDrop < Liquid::Drop
  # @api
  attr_reader :product_variant

  # @!method name
  #   @return [String] The name of this variant
  # @!method product
  #   @return [ProductDrop] The product this is a variant of
  delegate :name, :product, to: :product_variant

  # @api
  def initialize(product_variant)
    @product_variant = product_variant
  end

  # @return [String] The description of this variant, as HTML
  def description
    product.description_template&.render(self)
  end

  # @return [String] The URL of this variant's image, if present
  def image_url
    return unless product_variant.image
    product_variant.image.url
  end

  # @return [String] The price of this variant
  def price
    product_variant.price.format
  end
end
