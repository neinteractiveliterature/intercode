# A variant of a product that can be sold at this convention
class ProductVariantDrop < Liquid::Drop
  # @api
  attr_reader :product_variant

  # @!method name
  #   @return [String] The name of this variant
  # @!method product
  #   @return [ProductDrop] The product this is a variant of
  # @!method override_pricing_structure
  #   @return [PricingStructure] The pricing structure override for this variant, if present.  If
  #                              this is null, this variant will use the product's overall pricing
  #                              structure.  If it's present, this variant will use the override
  #                              pricing structure instead.
  delegate :name, :product, :override_pricing_structure, to: :product_variant

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
end
