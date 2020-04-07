class Product < ApplicationRecord
  PAYMENT_OPTIONS = %w[stripe pay_at_convention]

  belongs_to :convention
  has_many :product_variants, dependent: :destroy
  has_many :order_entries, dependent: :destroy
  belongs_to :provides_ticket_type, class_name: 'TicketType', optional: true

  mount_uploader :image, ProductImageUploader
  serialize :pricing_structure, ActiveModelCoder.new('PricingStructure')

  validate :ensure_valid_payment_options
  validate :ensure_ticket_providing_products_cannot_have_variants

  scope :available, -> { where(available: true) }
  scope :ticket_providing, -> { where.not(provides_ticket_type_id: nil) }

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

  def ensure_ticket_providing_products_cannot_have_variants
    return unless provides_ticket_type
    return unless product_variants.any?

    ticket_name = convention&.ticket_name&.capitalize || 'Ticket'
    errors.add :base, "#{ticket_name}-providing products cannot have variants"
  end
end
