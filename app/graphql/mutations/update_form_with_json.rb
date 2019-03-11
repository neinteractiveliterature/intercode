class Mutations::UpdateFormWithJSON < Mutations::BaseMutation
  field :form, Types::FormType, null: false

  argument :id, Integer, required: true
  argument :form_json, String, required: true, camelize: false

  def resolve(**args)
    form = convention.forms.find(args[:id])
    ImportFormContentService.new(form: form, content: JSON.parse(args[:form_json])).call!

    { form: form }
  end
end
