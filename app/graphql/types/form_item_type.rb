# frozen_string_literal: true
class Types::FormItemType < Types::BaseObject
  description "A single question or block of content on a form"
  field :admin_description, String, null: true, description: "An explanation of this item shown to form editors"
  field :default_value, Types::JSON, null: true, description: "The value this item starts with"
  field :expose_in,
        [Types::FormItemExposeInType],
        null: true,
        description: "The other places this item's value is made available"
  field :form_section,
        Types::FormSectionType,
        association_model: FormItem,
        null: false,
        camelize: false,
        description: "The form section containing this item"
  field :id, ID, null: false, description: "The ID of this form item"
  field :identifier, String, null: true, description: "The name this item's value is stored under in form responses"
  field :item_type, String, null: false, description: "The kind of input or content this item is"
  field :position, Int, null: false, description: "Where this item appears within its section"
  field :properties, Types::JSON, null: false, description: "The settings specific to this item type"
  field :public_description,
        String,
        null: true,
        description: "An explanation of this item shown to people filling out the form"
  field :rendered_properties,
        Types::JSON,
        null: false,
        description: "The item's settings, with any Markdown rendered as HTML"
  field :visibility,
        Types::FormItemRoleType,
        null: false,
        description: "The role someone needs to see this item's value"
  field :writeability,
        Types::FormItemRoleType,
        null: false,
        description: "The role someone needs to change this item's value"

  authorize_record

  def properties
    object.properties || {}
  end

  def rendered_properties
    FormItemPresenter.new(object, cadmus_renderer).rendered_properties
  end
end
