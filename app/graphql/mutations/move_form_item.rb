# frozen_string_literal: true
class Mutations::MoveFormItem < Mutations::BaseMutation
  field :form_item, Types::FormItemType, null: false
  field :form_section, Types::FormSectionType, null: false

  argument :id, ID, required: false
  argument :form_section_id, ID, required: false, camelize: true
  argument :destination_index, Integer, required: false, camelize: false

  load_and_authorize_model_with_id FormItem, :id, :update

  def resolve(form_section_id: nil, destination_index: nil, **_args)
    form_section = FormSection.find(form_section_id)
    unless form_section.form_id == form_item.form_section.form_id
      raise GraphQL::ExecutionError, 'Destination form section must be in the same form'
    end

    form_item.update!(form_section: form_section) unless form_section == form_item.form_section
    destination_index ? form_item.insert_at(destination_index + 1) : form_item.move_to_bottom

    { form_item: form_item, form_section: form_section }
  end
end
