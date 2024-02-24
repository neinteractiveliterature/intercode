# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: products
#
#  id                      :bigint           not null, primary key
#  available               :boolean
#  clickwrap_agreement     :text
#  description             :text
#  image                   :string
#  name                    :text
#  payment_options         :jsonb
#  pricing_structure       :jsonb            not null
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  convention_id           :bigint
#  provides_ticket_type_id :bigint
#
# Indexes
#
#  index_products_on_convention_id            (convention_id)
#  index_products_on_provides_ticket_type_id  (provides_ticket_type_id)
#
# Foreign Keys
#
#  fk_rails_...  (convention_id => conventions.id)
#  fk_rails_...  (provides_ticket_type_id => ticket_types.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

class Product < ApplicationRecord
  PAYMENT_OPTIONS = %w[stripe pay_at_convention].freeze

  belongs_to :convention
  has_many :product_variants, dependent: :destroy
  has_many :order_entries, dependent: :destroy
  belongs_to :provides_ticket_type, class_name: "TicketType", optional: true

  has_one_attached :image
  serialize :pricing_structure, coder: ActiveModelCoder.new("PricingStructure")

  validate :ensure_valid_payment_options
  validate :ensure_ticket_providing_products_cannot_have_variants
  validate :ensure_pricing_structure_is_valid

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
      errors.add :payment_options, "must be an array"
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

    ticket_name = convention&.ticket_name&.capitalize || "Ticket"
    errors.add :base, "#{ticket_name}-providing products cannot have variants"
  end

  def ensure_pricing_structure_is_valid
    return unless pricing_structure
    return if pricing_structure.valid?

    pricing_structure.errors.each { |error| errors.add(error.attribute, error.message) }
  end
end
