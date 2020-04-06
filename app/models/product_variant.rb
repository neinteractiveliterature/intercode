class ProductVariant < ApplicationRecord
  belongs_to :product

  mount_uploader :image, ProductImageUploader
  serialize :override_pricing_structure, ActiveModelCoder.new('PricingStructure', allow_nil: true)

  def to_liquid
    ProductVariantDrop.new(self)
  end

  def description_template
    return unless description
    @description_template ||= Liquid::Template.parse(description)
  end
end
