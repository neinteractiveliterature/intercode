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
  has_one_attached :as_image
  serialize :override_pricing_structure, ActiveModelCoder.new('PricingStructure', allow_nil: true)

  after_commit { update_active_storage if previous_changes.key?('image') }

  def update_active_storage
    as_image.purge if as_image.attached?
    sync_image if image.present?
  rescue StandardError => e
    Log.error(e)
  end

  def sync_image
    picture = image
    picture.cache_stored_file!
    file = StringIO.new(picture.sanitized_file.read)
    content_type = picture.content_type
    as_image.attach(io: file, content_type: content_type, filename: attributes['image'])
    as_image.save!
  end

  def to_liquid
    ProductVariantDrop.new(self)
  end

  def description_template
    return unless description
    @description_template ||= Liquid::Template.parse(description)
  end
end
