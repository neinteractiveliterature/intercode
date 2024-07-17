# frozen_string_literal: true
class Mutations::UpdateFormSection < Mutations::BaseMutation
  field :form_section, Types::FormSectionType, null: false

  argument :form_section, Types::FormSectionInputType, required: true, camelize: false
  argument :id, ID, required: false

  load_and_authorize_model_with_id FormSection, :id, :update

  def resolve(**args)
    form_section.update!(args[:form_section].to_h)

    { form_section: }
  end
end
