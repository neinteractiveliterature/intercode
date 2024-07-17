# frozen_string_literal: true
class Mutations::CreateFormWithJSON < Mutations::BaseMutation
  field :form, Types::FormType, null: false

  argument :form_json, String, required: true, camelize: false
  argument :form_type, Types::FormTypeType, required: true, camelize: false

  authorize_create_convention_associated_model :forms

  def resolve(form_json:, form_type:)
    form = context[:convention].forms.create!(form_type: form_type)
    ImportFormContentService.new(form: form, content: JSON.parse(form_json)).call!

    { form: form }
  end
end
