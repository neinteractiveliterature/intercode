# frozen_string_literal: true
class Types::ProductType < Types::BaseObject
  field :id, ID, null: false
  field :product_variants, [Types::ProductVariantType], null: false
  field :available, Boolean, null: false
  field :name, String, null: false
  field :description, String, null: true
  field :description_html, String, null: true
  field :provides_ticket_type, Types::TicketTypeType, null: true

  association_loaders Product, :product_variants, :provides_ticket_type

  def description_html
    return unless object.description_template
    context[:cadmus_renderer].render(object.description_template, :html)
  end

  field :image, Types::ActiveStorageAttachmentType, null: true

  def image
    ActiveStorageAttachmentLoader.for(Product, :as_image).load(object)
  end

  field :image_url, String, null: true, deprecation_reason: 'Please use the image field instead.'

  def image_url
    object.image&.url
  end

  field :pricing_structure, Types::PricingStructureType, null: false
  field :payment_options, [String], null: false
  field :order_quantities_by_status, [Types::OrderQuantityByStatusType], null: false

  def order_quantities_by_status
    OrderQuantityByStatusLoader.for(Product).load(object)
  end
end
