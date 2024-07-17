# frozen_string_literal: true
class Types::ProductType < Types::BaseObject
  field :id, ID, null: false

  field :image, Types::ActiveStorageAttachmentType, null: true

  field :image_url, String, null: true, deprecation_reason: "Please use the image field instead."

  field :pricing_structure, Types::PricingStructureType, null: false

  field :payment_options, [String], null: false

  field :order_quantities_by_status, [Types::OrderQuantityByStatusType], null: false

  field :available, Boolean, null: false
  field :clickwrap_agreement, String, null: true
  field :clickwrap_agreement_html, String, null: true
  field :description, String, null: true
  field :description_html, String, null: true
  field :name, String, null: false
  field :product_variants, [Types::ProductVariantType], null: false
  field :provides_ticket_type, Types::TicketTypeType, null: true

  association_loaders Product, :product_variants, :provides_ticket_type

  def description_html
    return nil unless object.description_template
    context[:cadmus_renderer].render(object.description_template, :html)
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
