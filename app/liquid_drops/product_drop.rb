class ProductDrop < Liquid::Drop
  include Rails.application.routes.url_helpers

  attr_reader :product
  delegate :available, :name, to: :product

  def initialize(product)
    @product = product
  end

  def description
    product.description_template&.render(self)
  end

  def image_url
    return unless product.image
    product.image.url
  end

  def price
    product.price.format
  end

  def product_variants
    product.product_variants.to_a
  end

  def url
    product_path(product)
  end
end
