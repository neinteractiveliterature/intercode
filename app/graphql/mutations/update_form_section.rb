# frozen_string_literal: true
class Mutations::UpdateFormSection < Mutations::BaseMutation
  field :form_section, Types::FormSectionType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false
  argument :form_section, Types::FormSectionInputType, required: true, camelize: false

  load_and_authorize_model_with_id FormSection, :id, :update

  def resolve(**args)
    form_section.update!(args[:form_section].to_h)

    { form_section: form_section }
  end
end
