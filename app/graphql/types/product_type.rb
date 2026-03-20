# frozen_string_literal: true
class Types::ProductType < Types::BaseObject
  description "A product available for purchase at a convention"

  field :available, Boolean, null: false, description: "Whether this product is currently available for purchase"
  # rubocop:disable GraphQL/ExtractType
  field :clickwrap_agreement, String, null: true, description: "The raw Liquid template for the clickwrap agreement"
  field :clickwrap_agreement_html, String, null: true, description: "The rendered HTML of the clickwrap agreement"
  # rubocop:enable GraphQL/ExtractType
  field :convention, Types::ConventionType, null: false, description: "The convention this product belongs to"
  field :description, String, null: true, description: "A description of the product in Liquid template format"
  field :description_html, String, null: true, description: "The rendered HTML description of the product"
  field :id, ID, null: false, description: "The unique identifier for this product"
  field :image, Types::ActiveStorageAttachmentType, null: true, description: "The product image attachment"
  field :image_url,
        String,
        null: true,
        deprecation_reason: "Please use the image field instead.",
        description: "The URL of the product image"
  field :name, String, null: false, description: "The name of the product"
  field :order_quantities_by_status,
        [Types::OrderQuantityByStatusType],
        null: false,
        description: "The quantities of this product ordered, grouped by order status"
  field :payment_options, [String], null: false, description: "The accepted payment options for this product"
  field :pricing_structure,
        Types::PricingStructureType,
        null: false,
        description: "The pricing structure for this product"
  field :product_variants,
        [Types::ProductVariantType],
        null: false,
        description: "The variants available for this product"
  field :provides_ticket_type,
        Types::TicketTypeType,
        null: true,
        description: "The ticket type this product provides, if any"

  association_loaders Product, :product_variants, :provides_ticket_type, :convention

  def description_html
    return nil unless object.description_template
    cadmus_renderer.render(object.description_template, :html)
  end

  def clickwrap_agreement_html
    return nil if object.clickwrap_agreement.blank?
    cadmus_renderer.render(Liquid::Template.parse(object.clickwrap_agreement), :html)
  end

  def image
    dataloader.with(Sources::ActiveStorageAttachment, Product, :image).load(object)
  end

  def image_url
    object.image&.url
  end

  def order_quantities_by_status
    dataloader.with(Sources::OrderQuantityByStatus, Product).load(object)
  end
end
