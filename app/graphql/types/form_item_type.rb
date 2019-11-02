class Types::FormItemType < Types::BaseObject
  field :id, Int, null: false
  field :position, Int, null: true
  field :identifier, String, null: true
  field :item_type, String, null: true
  field :admin_description, String, null: true
  field :public_description, String, null: true
  field :default_value, Types::JSON, null: true
  field :properties, Types::JSON, null: true
  field :rendered_properties, Types::JSON, null: true
  field :form_section, Types::FormSectionType, null: false, camelize: false

  association_loaders FormItem, :form_section

  authorize_record

  def rendered_properties
    FormItemPresenter.new(object, cadmus_renderer).rendered_properties
  end
end
