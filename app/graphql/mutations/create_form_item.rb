# frozen_string_literal: true
class Mutations::CreateFormItem < Mutations::BaseMutation
  field :form_item, Types::FormItemType, null: false

  argument :transitional_form_section_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the formSectionId field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :form_section_id, ID, required: false, camelize: true
  argument :form_item, Types::FormItemInputType, required: true, camelize: false

  attr_reader :form_item

  def authorized?(args)
    form_section = FormSection.find(args[:transitional_form_section_id] || args[:form_section_id])
    @form_item = form_section.form_items.new(args[:form_item].to_h)
    self.class.check_authorization(policy(form_item), :create)
  end

  def resolve(**_args)
    form_item.save!
    { form_item: form_item }
  end
end
