class Coupon < ApplicationRecord
  belongs_to :convention
  belongs_to :provides_product, class_name: 'Product', optional: true
  has_many :coupon_applications, dependent: :destroy

  monetize :fixed_amount_cents, with_model_currency: :fixed_amount_currency, allow_nil: true

  validates :code, presence: true, uniqueness: { scope: :convention_id }
  validates :percent_discount, numericality: {
    allow_nil: true, greater_than: 0, less_than_or_equal_to: 100
  }
  validate :ensure_convention_matches_provided_product
  validate :ensure_exactly_one_discount_model

  before_validation do
    self.code = Devise.friendly_token if code.blank?
  end

  def expired?
    return false unless expires_at
    expires_at <= Time.zone.now
  end

  def usage_limit_reached?
    return false unless usage_limit
    usage_limit <= coupon_applications.active.count
  end

  private

  def ensure_convention_matches_provided_product
    return unless convention && provides_product
    return if convention == provides_product.convention

    errors.add :provides_product, "must be a product in #{convention.name} \
(but is instead in #{provides_product.convention.name})"
  end

  def ensure_exactly_one_discount_model
    discount_models = %w[
      fixed_amount provides_product percent_discount
    ].each_with_object({}) do |field, hash|
      hash[field] = public_send(field)
    end.compact

    return if discount_models.size == 1

    if discount_models.empty?
      errors.add :base,
        'Must have either a fixed discount amount, a percentage discount, or a provided product'
    else
      errors.add :base, "Must have only one discount type, but has \
#{discount_models.keys.map(&:humanize).to_sentence}"
    end
  end
end
