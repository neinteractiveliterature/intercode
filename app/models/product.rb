class Product < ApplicationRecord
  belongs_to :convention
  has_many :product_variants

  mount_uploader :image, ProductImageUploader
  monetize :price_cents, with_model_currency: :price_currency, allow_nil: true
end
