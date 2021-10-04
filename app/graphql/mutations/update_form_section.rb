# frozen_string_literal: true
class Mutations::UpdateFormSection < Mutations::BaseMutation
  field :form_section, Types::FormSectionType, null: false

  argument :id,
           Integer,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false
  argument :transitional_id, ID, required: false, camelize: true
  argument :form_section, Types::FormSectionInputType, required: true, camelize: false

  load_and_authorize_model_with_id FormSection, :id, :update

  def resolve(**args)
    form_section.update!(args[:form_section].to_h)

    { form_section: form_section }
  end
end
