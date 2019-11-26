class Mutations::UpdateFormWithJSON < Mutations::BaseMutation
  field :form, Types::FormType, null: false

  argument :id, Integer, required: true
  argument :form_json, String, required: true, camelize: false

  load_and_authorize_convention_associated_model :forms, :id, :update

  def resolve(**args)
    ImportFormContentService.new(form: form, content: JSON.parse(args[:form_json])).call!

    { form: form }
  end
end
