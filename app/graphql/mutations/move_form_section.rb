# frozen_string_literal: true
class Mutations::MoveFormSection < Mutations::BaseMutation
  field :form_section, Types::FormSectionType, null: false
  field :form, Types::FormType, null: false

  argument :id,
           Integer,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false
  argument :transitional_id, ID, required: false, camelize: true
  argument :destination_index, Integer, required: true, camelize: false

  load_and_authorize_model_with_id FormSection, :id, :update

  def resolve(destination_index: nil, **_args)
    form_section.insert_at(destination_index + 1)
    { form: form_section.form, form_section: form_section }
  end
end
