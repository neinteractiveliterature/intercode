# frozen_string_literal: true
class Mutations::MoveFormSection < Mutations::BaseMutation
  field :form_section, Types::FormSectionType, null: false
  field :form, Types::FormType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false
  argument :destination_index, Integer, required: true, camelize: false

  load_and_authorize_model_with_id FormSection, :id, :update

  def resolve(destination_index: nil, **_args)
    form_section.insert_at(destination_index + 1)
    { form: form_section.form, form_section: form_section }
  end
end
