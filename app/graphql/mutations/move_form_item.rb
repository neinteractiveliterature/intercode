# frozen_string_literal: true
class Mutations::MoveFormItem < Mutations::BaseMutation
  field :form_item, Types::FormItemType, null: false
  field :form_section, Types::FormSectionType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false
  argument :transitional_form_section_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the formSectionId field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :form_section_id, ID, required: false, camelize: true
  argument :destination_index, Integer, required: false, camelize: false

  load_and_authorize_model_with_id FormItem, :id, :update

  def resolve(form_section_id: nil, transitional_form_section_id: nil, destination_index: nil, **_args)
    form_section = FormSection.find(transitional_form_section_id || form_section_id)
    unless form_section.form_id == form_item.form_section.form_id
      raise GraphQL::ExecutionError, 'Destination form section must be in the same form'
    end

    form_item.update!(form_section: form_section) unless form_section == form_item.form_section
    destination_index ? form_item.insert_at(destination_index + 1) : form_item.move_to_bottom

    { form_item: form_item, form_section: form_section }
  end
end
