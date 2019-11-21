class Mutations::DeleteFormSection < Mutations::BaseMutation
  argument :id, Int, required: true, camelize: false

  load_and_authorize_model_with_id FormSection, :id, :destroy

  def resolve(**_args)
    form_section.destroy!
    {}
  end
end
