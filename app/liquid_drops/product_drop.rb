# A product that can be sold through the convention's web site
class ProductDrop < Liquid::Drop
  include Rails.application.routes.url_helpers

  # @api
  attr_reader :product

  # @!method available
  #   @return [Boolean] Whether or not the product is publicly available for purchase
  # @!method name
  #   @return [String] The name of the product
  # @!method payment_options
  #   @return [Array<String>] The purchase methods allowed for this product (e.g. stripe,
  #                           pay_at_convention)
  # @!method pricing_structure
  #   @return [PricingStructure] The pricing structure for this product
  delegate :available, :name, :payment_options, :pricing_structure, to: :product

  # @api
  def initialize(product)
    @product = product
  end

  # @return [String] The description of the product, as HTML
  def description
    product.description_template&.render(self)
  end

  # @return [String] The URL of the product image, if present
  def image_url
    return unless product.image
    product.image.url
  end

  # @return [String] The base price for the product
  # @deprecated Price is now controlled through the pricing_structure field
  def price
    product.pricing_structure.price.format
  end

  # @return [Array<ProductVariantDrop>] Any variants of this product
  def product_variants
    product.product_variants.to_a
  end

  # @return [String] The relative URL to use for linking to this product's page
  def url
    "/products/#{product.to_param}"
  end
end
