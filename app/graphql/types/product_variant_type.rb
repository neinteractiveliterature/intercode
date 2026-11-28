# frozen_string_literal: true
class Types::ProductVariantType < Types::BaseObject
  description "One of the options a product comes in, such as a shirt size"
  field :id, ID, null: false, description: "The ID of this product variant"

  field :name, String, null: false, description: "The name of this variant"

  field :description, String, null: true, description: "A description of this variant"

  field :description_html, String, null: true, description: "The description, rendered as HTML"

  field :image, Types::ActiveStorageAttachmentType, null: true, description: "A picture of this variant"

  field :image_url,
        String,
        null: true,
        deprecation_reason: "Please use the image field instead.",
        description: "The URL of the picture of this variant"

  field :override_pricing_structure,
        Types::PricingStructureType,
        null: true,
        description: "The pricing for this variant, if it differs from the product's"

  field :position, Integer, null: true, description: "Where this variant appears among the product's variants"

  field :order_quantities_by_status,
        [Types::OrderQuantityByStatusType],
        null: false,
        description: "How many of this variant have been ordered, grouped by order status"

  field :product, Types::ProductType, null: false, description: "The product this is a variant of"

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
