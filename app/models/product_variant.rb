# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: product_variants
#
#  id                         :bigint           not null, primary key
#  description                :text
#  image                      :string
#  name                       :text
#  override_pricing_structure :jsonb
#  position                   :integer
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  product_id                 :bigint
#
# Indexes
#
#  index_product_variants_on_product_id  (product_id)
#
# Foreign Keys
#
#  fk_rails_...  (product_id => products.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

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
