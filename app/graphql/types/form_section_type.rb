class Types::FormSectionType < Types::BaseObject
  field :id, Int, null: false
  field :title, String, null: true
  field :form, Types::FormType, null: false, camelize: false
  field :position, Int, null: true
  field :form_items, [Types::FormItemType], null: false, camelize: false

  association_loaders FormSection, :form, :form_items

  authorize_record
end
