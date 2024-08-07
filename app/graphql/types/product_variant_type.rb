# frozen_string_literal: true
class Types::ProductVariantType < Types::BaseObject
  field :id, ID, null: false

  field :name, String, null: false

  field :description, String, null: true

  field :description_html, String, null: true

  field :image, Types::ActiveStorageAttachmentType, null: true

  field :image_url, String, null: true, deprecation_reason: "Please use the image field instead."

  field :override_pricing_structure, Types::PricingStructureType, null: true

  field :position, Integer, null: true

  field :order_quantities_by_status, [Types::OrderQuantityByStatusType], null: false

  field :product, Types::ProductType, null: false

  association_loaders ProductVariant, :product

  def description_html
    return unless object.description
    context[:cadmus_renderer].render(object.description, :html)
  end

  def image
    dataloader.with(Sources::ActiveStorageAttachment, ProductVariant, :image).load(object)
  end

  def image_url
    object.image&.url
  end

  def order_quantities_by_status
    dataloader.with(Sources::OrderQuantityByStatus, ProductVariant).load(object)
  end
end
