class ProductVariant < ApplicationRecord
  belongs_to :product

  mount_uploader :image, ProductImageUploader
  monetize :override_price_cents, with_model_currency: :override_price_currency, allow_nil: true

  def to_liquid
    ProductVariantDrop.new(self)
  end

  def description_template
    return unless description
    @description_template ||= Liquid::Template.parse(description)
  end
end
