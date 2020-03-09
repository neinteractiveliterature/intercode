class Product < ApplicationRecord
  PAYMENT_OPTIONS = %w[stripe pay_at_convention]

  belongs_to :convention
  has_many :product_variants, dependent: :destroy
  has_many :order_entries, dependent: :destroy

  mount_uploader :image, ProductImageUploader
  monetize :price_cents, with_model_currency: :price_currency, allow_nil: true

  validate :ensure_valid_payment_options

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

  private

  def ensure_valid_payment_options
    unless payment_options.is_a?(Array)
      errors.add :payment_options, 'must be an array'
      return
    end

    invalid_payment_options = payment_options - PAYMENT_OPTIONS
    return unless invalid_payment_options.any?

    errors.add :payment_options, <<~EOF
      #{invalid_payment_options.to_sentence} are not recognized.  Valid payment options are
      #{PAYMENT_OPTIONS.to_sentence}.
    EOF
  end
end
