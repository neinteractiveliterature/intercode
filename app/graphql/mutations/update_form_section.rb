class Mutations::UpdateFormSection < Mutations::BaseMutation
  field :form_section, Types::FormSectionType, null: false

  argument :id, Integer, required: true
  argument :form_section, Types::FormSectionInputType, required: true, camelize: false

  load_and_authorize_model_with_id FormSection, :id, :update

  def resolve(**args)
    form_section.update!(args[:form_section].to_h)

    { form_section: form_section }
  end
end
