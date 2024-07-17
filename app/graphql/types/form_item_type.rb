# frozen_string_literal: true
class Types::FormItemType < Types::BaseObject
  field :admin_description, String, null: true
  field :default_value, Types::JSON, null: true
  field :expose_in, [Types::FormItemExposeInType], null: true
  field :form_section, Types::FormSectionType, null: false, camelize: false
  field :id, ID, null: false
  field :identifier, String, null: true
  field :item_type, String, null: false
  field :position, Int, null: false
  field :properties, Types::JSON, null: false
  field :public_description, String, null: true
  field :rendered_properties, Types::JSON, null: false
  field :visibility, Types::FormItemRoleType, null: false
  field :writeability, Types::FormItemRoleType, null: false

  association_loaders FormItem, :form_section

  authorize_record

  def properties
    object.properties || {}
  end

  def rendered_properties
    FormItemPresenter.new(object, cadmus_renderer).rendered_properties
  end
end
