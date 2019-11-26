class Mutations::CreateForm < Mutations::BaseMutation
  field :form, Types::FormType, null: false

  argument :form, Types::FormInputType, required: true, camelize: false
  argument :form_type, Types::FormTypeType, required: true, camelize: false

  authorize_create_convention_associated_model :forms

  def resolve(form:, form_type:)
    form = context[:convention].forms.create!(form.to_h.merge(form_type: form_type))
    section = form.form_sections.create!(title: form.title)
    type_config = Form::FORM_TYPE_CONFIG[form_type]
    type_config['standard_items'].each do |identifier, item_config|
      next unless item_config['required']

      item_type = item_config['item_type'] || 'free_text'
      default_properties = FormItem::DEFAULT_PROPERTIES_CONFIG[item_type] || {}
      properties = default_properties
      if FormItem::PROPERTIES_SCHEMA[item_type]['caption']
        properties = properties.merge('caption' => item_config['description'])
      end

      section.form_items.create!(
        identifier: identifier,
        item_type: item_type,
        properties: properties
      )
    end

    { form: form }
  end
end
