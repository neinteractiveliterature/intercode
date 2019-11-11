class Mutations::CreateFormItem < Mutations::BaseMutation
  field :form_item, Types::FormItemType, null: false

  argument :form_section_id, Integer, required: false, camelize: false
  argument :form_item, Types::FormItemInputType, required: true, camelize: false

  attr_reader :form_item

  def authorized?(args)
    form_section = FormSection.find(args[:form_section_id])
    @form_item = form_section.form_items.new(args[:form_item].to_h)
    self.class.check_authorization(policy(form_item), :create)
  end

  def resolve(**_args)
    form_item.save!
    { form_item: form_item }
  end
end
