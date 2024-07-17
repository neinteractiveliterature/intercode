# frozen_string_literal: true
class Types::FormItemType < Types::BaseObject
  field :id, ID, null: false
  field :position, Int, null: false
  field :identifier, String, null: true
  field :item_type, String, null: false
  field :admin_description, String, null: true
  field :public_description, String, null: true
  field :default_value, Types::JSON, null: true
  field :properties, Types::JSON, null: false
  field :rendered_properties, Types::JSON, null: false
  field :form_section, Types::FormSectionType, null: false, camelize: false
  field :visibility, Types::FormItemRoleType, null: false
  field :writeability, Types::FormItemRoleType, null: false
  field :expose_in, [Types::FormItemExposeInType], null: true

  association_loaders FormItem, :form_section

  authorize_record

  def properties
    object.properties || {}
  end

  def rendered_properties
    FormItemPresenter.new(object, cadmus_renderer).rendered_properties
  end
end
