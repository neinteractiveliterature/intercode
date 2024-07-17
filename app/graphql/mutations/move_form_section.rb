# frozen_string_literal: true
class Mutations::MoveFormSection < Mutations::BaseMutation
  field :form, Types::FormType, null: false
  field :form_section, Types::FormSectionType, null: false

  argument :destination_index, Integer, required: true, camelize: false
  argument :id, ID, required: false

  load_and_authorize_model_with_id FormSection, :id, :update

  def resolve(destination_index: nil, **_args)
    form_section.insert_at(destination_index + 1)
    { form: form_section.form, form_section: }
  end
end
