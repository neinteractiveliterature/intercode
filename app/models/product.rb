class Product < ApplicationRecord
  belongs_to :convention
  has_many :product_variants
  has_many :order_entries, dependent: :destroy

  mount_uploader :image, ProductImageUploader
  monetize :price_cents, with_model_currency: :price_currency, allow_nil: true

  scope :available, -> { where(available: true) }

  def to_param
    "#{id}-#{name.parameterize}"
  end

  def to_liquid
    ProductDrop.new(self)
  end

  def description_template
    return unless description
    @description_template ||= Liquid::Template.parse(description)
  end
end
