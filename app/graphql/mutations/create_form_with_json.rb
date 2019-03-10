class Mutations::CreateFormWithJSON < Mutations::BaseMutation
  field :form, Types::FormType, null: false

  argument :form_json, String, required: true, camelize: false

  def resolve(form_json:)
    form = context[:convention].forms.create!
    ImportFormContentService.new(form: form, content: JSON.parse(form_json)).call!

    { form: form }
  end
end
