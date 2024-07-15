# frozen_string_literal: true
class Mutations::CreateForm < Mutations::BaseMutation
  description "Create a new form in a convention."

  field :form, Types::FormType, null: false, description: "The form that has just been created."

  argument :form, Types::FormInputType, required: true, description: "The properties for the form to create."
  argument :form_type, Types::FormTypeType, required: true, camelize: false do
    description "The type of form to create."
  end

  authorize_create_convention_associated_model :forms

  def resolve(form:, form_type:)
    form = context[:convention].forms.create!(form.to_h.merge(form_type:))
    section = form.form_sections.create!(title: form.title)
    type_config = Form::FORM_TYPE_CONFIG[form_type]
    type_config["standard_items"].each do |identifier, item_config|
      next unless item_config["required"]

      item_type = item_config["item_type"] || "free_text"
      default_properties = FormItem::DEFAULT_PROPERTIES_CONFIG[item_type] || {}
      properties = default_properties.merge(item_config["default_properties"] || {})
      if FormItem::PROPERTIES_SCHEMA[item_type]["caption"]
        properties = properties.merge("caption" => item_config["description"])
      end

      section.form_items.create!(identifier:, item_type:, properties:)
    end

    { form: }
  end
end
