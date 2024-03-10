# frozen_string_literal: true
class Types::ProductVariantType < Types::BaseObject
  field :id, ID, null: false
  field :product, Types::ProductType, null: false

  association_loaders ProductVariant, :product

  field :name, String, null: false
  field :description, String, null: true
  field :description_html, String, null: true

  def description_html
    return unless object.description
    context[:cadmus_renderer].render(object.description, :html)
  end

  field :image, Types::ActiveStorageAttachmentType, null: true

  def image
    dataloader.with(Sources::ActiveStorageAttachment, ProductVariant, :image).load(object)
  end

  field :image_url, String, null: true, deprecation_reason: "Please use the image field instead."

  def image_url
    object.image&.url
  end

  field :override_pricing_structure, Types::PricingStructureType, null: true
  field :position, Integer, null: true

  field :order_quantities_by_status, [Types::OrderQuantityByStatusType], null: false

  def order_quantities_by_status
    dataloader.with(Sources::OrderQuantityByStatus, ProductVariant).load(object)
  end
end
